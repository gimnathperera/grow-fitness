import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Plus } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function MessagesTab() {
  return (
    <Card className="border-[#23B685]/20">
      <CardHeader>
        <CardTitle className="text-[#243E36] flex items-center justify-between">
          <span className="flex items-center">
            <MessageCircle className="mr-2 h-5 w-5" />
            Messages from Parents
          </span>
          <Button
            size="sm"
            className="!bg-primary hover:!bg-primary/90 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Message
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-[#23B685]/5 rounded-lg">
            <div className="flex items-start space-x-3">
              <Avatar>
                <AvatarFallback className="bg-primary text-white">
                  MJ
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-primary">
                    Mrs. Johnson (Emma's Mom)
                  </h4>
                  <span className="text-xs text-gray-500">1 hour ago</span>
                </div>
                <p className="text-sm text-gray-700">
                  Thank you for the wonderful session today! Emma came home so
                  excited about the obstacle course. She's been practicing her
                  balance at home. 😊
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2 text-white hover:!bg-primary/90 hover:text-white !bg-primary"
                >
                  Reply
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
