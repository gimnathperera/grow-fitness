import { ConfigService } from '@nestjs/config';
export declare class MailerService {
    private configService;
    private transporter;
    constructor(configService: ConfigService);
    sendSessionReminder(to: string, childName: string, sessionDate: Date, sessionTime: string, location: string, reminderType: '24h' | '1h'): Promise<void>;
    sendDailyDigest(to: string, todaySessions: any[], pendingRequests: any[], userRole: 'admin' | 'coach'): Promise<void>;
    sendMilestoneCongratulations(to: string, childName: string, milestoneName: string, achievementDate: Date): Promise<void>;
    private sendEmail;
}
