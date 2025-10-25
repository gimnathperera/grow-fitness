import ChatBot from 'react-chatbotify';
import type { CSSProperties } from 'react';
import type { Flow, Params, Settings, Styles } from 'react-chatbotify';

const mainMenuOptions = [
  'Explore training programs',
  'Track my progress',
  'Talk to a coach',
  'Account support',
];

const followUpOptions = ['Back to menu', 'Contact support', "That's all"];

const resolveMainSelection = ({ userInput }: Params): string => {
  switch (userInput) {
    case 'Explore training programs':
      return 'programs_overview';
    case 'Track my progress':
      return 'progress_guidance';
    case 'Talk to a coach':
      return 'coach_support';
    case 'Account support':
      return 'support_details';
    default:
      return 'unknown_selection';
  }
};

const resolveFollowUpSelection = ({ userInput }: Params): string => {
  switch (userInput) {
    case 'Back to menu':
      return 'start';
    case 'Contact support':
      return 'support_details';
    case "That's all":
      return 'conversation_complete';
    default:
      return 'start';
  }
};

const chatbotFlow: Flow = {
  start: {
    message:
      "Hi there! I'm the GrowFitness assistant. What would you like help with today?",
    options: mainMenuOptions,
    path: resolveMainSelection,
  },
  programs_overview: {
    message:
      'Our training tracks balance strength, mobility, and recovery. You can explore recommendations tailored to each family member from the dashboard programs tab.',
    path: 'follow_up_prompt',
  },
  progress_guidance: {
    message:
      'Head to your dashboard to review recent workouts, streaks, and milestone badges. Sync your wearable to keep progress insights up to date.',
    path: 'follow_up_prompt',
  },
  coach_support: {
    message:
      'Need coaching support? Visit the coach dashboard to review assigned sessions or request feedback. Your coach will reach out once a new note is added.',
    path: 'follow_up_prompt',
  },
  support_details: {
    message:
      'You can reach our team at support@growfitness.com or open the contact link in the site footer for quick help with billing or account access.',
    path: 'follow_up_prompt',
  },
  follow_up_prompt: {
    message: 'Anything else I can do for you?',
    options: followUpOptions,
    path: resolveFollowUpSelection,
  },
  unknown_selection: {
    message:
      "I'm best at guiding you through programs, progress tracking, coaches, or account support. Try picking one of the quick actions below.",
    options: mainMenuOptions,
    path: resolveMainSelection,
  },
  conversation_complete: {
    message: 'Happy to help! I will be right here if you need anything else.',
    transition: { duration: 2500 },
    path: 'start',
  },
};

const chatbotSettings: Settings = {
  general: {
    primaryColor: '#16a34a',
    secondaryColor: '#075985',
    showFooter: false,
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  tooltip: {
    text: 'Need a hand?',
  },
  header: {
    title: 'GrowFit Assistant',
    showAvatar: false,
  },
  chatInput: {
    enabledPlaceholderText: 'Ask about programs, progress, or getting help...',
  },
  chatWindow: {
    showMessagePrompt: true,
    messagePromptText: 'Chat with GrowFitness',
  },
  notification: {
    defaultToggledOn: true,
  },
  botBubble: {
    showAvatar: true,
  },
  userBubble: {
    showAvatar: true,
  },
};

const baseBubbleStyle: CSSProperties = {
  fontSize: '0.85rem',
  lineHeight: 1.35,
  padding: '0.4rem 0.7rem',
  borderRadius: 12,
  maxWidth: '80%',
};

const chatbotStyles: Styles = {
  chatWindowStyle: {
    width: 320,
    maxWidth: 'calc(100vw - 1.5rem)',
    borderRadius: 18,
    boxShadow: '0 18px 40px rgba(15, 23, 42, 0.12)',
    border: '1px solid rgba(148, 163, 184, 0.25)',
  },
  headerStyle: {
    padding: '0.65rem 1rem',
    minHeight: '3rem',
    fontSize: '1rem',
  },
  bodyStyle: {
    padding: '0.65rem',
    gap: '0.5rem',
  },
  botBubbleStyle: {
    ...baseBubbleStyle,
    backgroundColor: '#f8fafc',
    color: '#0f172a',
  },
  userBubbleStyle: {
    ...baseBubbleStyle,
    backgroundColor: '#dcfce7',
    color: '#166534',
  },
  botOptionStyle: {
    fontSize: '0.85rem',
    padding: '0.4rem 0.7rem',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#10b981',
    color: '#047857',
    backgroundColor: '#ffffff',
  },
  botOptionHoveredStyle: {
    backgroundColor: '#16a34a',
    borderColor: '#16a34a',
    color: '#ffffff',
    boxShadow: '0 8px 16px rgba(22, 163, 74, 0.25)',
  },
  chatInputContainerStyle: {
    padding: '0.55rem 0.65rem',
    gap: '0.45rem',
  },
  chatInputAreaStyle: {
    fontSize: '0.85rem',
    padding: '0.4rem 0.6rem',
    borderRadius: 12,
    border: '1px solid #cbd5f5',
    minHeight: '2.25rem',
  },
  chatInputAreaFocusedStyle: {
    borderColor: '#16a34a',
    boxShadow: '0 0 0 2px rgba(22, 163, 74, 0.12)',
  },
  sendButtonStyle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendIconStyle: {
    width: 14,
    height: 14,
    margin: 0,
  },
  chatButtonStyle: {
    width: 56,
    height: 56,
    borderRadius: 9999,
    boxShadow: '0 14px 30px rgba(15, 23, 42, 0.18)',
  },
  chatButtonHoveredStyle: {
    transform: 'translateY(-2px)',
  },
  chatMessagePromptStyle: {
    fontSize: '0.75rem',
    padding: '0.35rem 0.7rem',
  },
};

const GrowChatbot = () => (
  <ChatBot
    id="growfit-assistant"
    flow={chatbotFlow}
    settings={chatbotSettings}
    styles={chatbotStyles}
  />
);

export default GrowChatbot;
