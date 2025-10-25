"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailerService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = __importStar(require("nodemailer"));
let MailerService = class MailerService {
    configService;
    transporter;
    constructor(configService) {
        this.configService = configService;
        this.transporter = nodemailer.createTransport({
            host: this.configService.get('SMTP_HOST'),
            port: this.configService.get('SMTP_PORT'),
            secure: false,
            auth: {
                user: this.configService.get('SMTP_USER'),
                pass: this.configService.get('SMTP_PASS'),
            },
        });
    }
    async sendSessionReminder(to, childName, sessionDate, sessionTime, location, reminderType) {
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
    async sendDailyDigest(to, todaySessions, pendingRequests, userRole) {
        const subject = 'Daily Digest - Grow Fitness';
        const html = `
      <h2>Daily Digest - ${new Date().toLocaleDateString()}</h2>
      <p>Dear ${userRole === 'admin' ? 'Admin' : 'Coach'},</p>
      
      <h3>Today's Sessions (${todaySessions.length})</h3>
      ${todaySessions.length > 0
            ? `
        <ul>
          ${todaySessions
                .map((session) => `
            <li>${session.time} - ${session.children} at ${session.location}</li>
          `)
                .join('')}
        </ul>
      `
            : '<p>No sessions scheduled for today.</p>'}
      
      ${userRole === 'admin'
            ? `
        <h3>Pending Requests (${pendingRequests.length})</h3>
        ${pendingRequests.length > 0
                ? `
          <ul>
            ${pendingRequests
                    .map((request) => `
              <li>${request.type} request for ${request.session} - ${request.requester}</li>
            `)
                    .join('')}
          </ul>
        `
                : '<p>No pending requests.</p>'}
      `
            : ''}
      
      <p>Have a great day!<br>Grow Fitness Team</p>
    `;
        await this.sendEmail(to, subject, html);
    }
    async sendMilestoneCongratulations(to, childName, milestoneName, achievementDate) {
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
    async sendEmail(to, subject, html) {
        const mailOptions = {
            from: this.configService.get('SMTP_USER'),
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
            }
            else {
                await this.transporter.sendMail(mailOptions);
            }
        }
        catch (error) {
            console.error('Failed to send email:', error);
            throw error;
        }
    }
};
exports.MailerService = MailerService;
exports.MailerService = MailerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MailerService);
//# sourceMappingURL=mailer.service.js.map