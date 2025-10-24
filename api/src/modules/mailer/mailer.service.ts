import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: false,
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  async sendSessionReminder(
    to: string,
    childName: string,
    sessionDate: Date,
    sessionTime: string,
    location: string,
    reminderType: '24h' | '1h',
  ): Promise<void> {
    const subject = `Session Reminder - ${reminderType === '24h' ? '24 Hours' : '1 Hour'} Notice`;
    const html = `
      <h2>Session Reminder</h2>
      <p>Dear Parent,</p>
      <p>This is a reminder that ${childName} has a fitness session:</p>
      <ul>
        <li><strong>Date:</strong> ${sessionDate.toLocaleDateString()}</li>
        <li><strong>Time:</strong> ${sessionTime}</li>
        <li><strong>Location:</strong> ${location}</li>
      </ul>
      <p>Please ensure your child arrives on time and brings appropriate clothing.</p>
      <p>Best regards,<br>Grow Fitness Team</p>
    `;

    await this.sendEmail(to, subject, html);
  }

  async sendDailyDigest(
    to: string,
    todaySessions: any[],
    pendingRequests: any[],
    userRole: 'admin' | 'coach',
  ): Promise<void> {
    const subject = 'Daily Digest - Grow Fitness';
    const html = `
      <h2>Daily Digest - ${new Date().toLocaleDateString()}</h2>
      <p>Dear ${userRole === 'admin' ? 'Admin' : 'Coach'},</p>
      
      <h3>Today's Sessions (${todaySessions.length})</h3>
      ${
        todaySessions.length > 0
          ? `
        <ul>
          ${todaySessions
            .map(
              (session) => `
            <li>${session.time} - ${session.children} at ${session.location}</li>
          `,
            )
            .join('')}
        </ul>
      `
          : '<p>No sessions scheduled for today.</p>'
      }
      
      ${
        userRole === 'admin'
          ? `
        <h3>Pending Requests (${pendingRequests.length})</h3>
        ${
          pendingRequests.length > 0
            ? `
          <ul>
            ${pendingRequests
              .map(
                (request) => `
              <li>${request.type} request for ${request.session} - ${request.requester}</li>
            `,
              )
              .join('')}
          </ul>
        `
            : '<p>No pending requests.</p>'
        }
      `
          : ''
      }
      
      <p>Have a great day!<br>Grow Fitness Team</p>
    `;

    await this.sendEmail(to, subject, html);
  }

  async sendMilestoneCongratulations(
    to: string,
    childName: string,
    milestoneName: string,
    achievementDate: Date,
  ): Promise<void> {
    const subject = `Congratulations! ${childName} achieved ${milestoneName}`;
    const html = `
      <h2>🎉 Congratulations!</h2>
      <p>Dear Parent,</p>
      <p>We're thrilled to announce that ${childName} has achieved the milestone:</p>
      <h3>${milestoneName}</h3>
      <p>Achieved on: ${achievementDate.toLocaleDateString()}</p>
      <p>This is a wonderful accomplishment and we're proud of ${childName}'s dedication and progress!</p>
      <p>Keep up the great work!<br>Grow Fitness Team</p>
    `;

    await this.sendEmail(to, subject, html);
  }

  private async sendEmail(
    to: string,
    subject: string,
    html: string,
  ): Promise<void> {
    const mailOptions = {
      from: this.configService.get<string>('SMTP_USER'),
      to,
      subject,
      html,
    };

    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('📧 Email would be sent:', {
          to,
          subject,
          html: html.substring(0, 200) + '...',
        });
      } else {
        await this.transporter.sendMail(mailOptions);
      }
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }
}
