import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Send,
  Search,
  Filter,
  MoreHorizontal,
  Star,
  Archive,
  Trash2,
  User,
  Building,
  Clock,
  ArrowLeft,
  Paperclip,
  Smile
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { employeeService } from '../../services/employeeService';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface Message {
  id: number;
  sender_id: number;
  sender_name: string;
  sender_type: 'employer' | 'employee' | 'admin';
  sender_company?: string;
  subject: string;
  content: string;
  is_read: boolean;
  created_at: string;
  thread_id?: number;
  attachments?: any[];
}

export const MessagesPage: React.FC = () => {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [messageFilter, setMessageFilter] = useState<'all' | 'unread' | 'starred'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCompose, setShowCompose] = useState(false);
  const [composeData, setComposeData] = useState({
    recipient_id: '',
    subject: '',
    content: ''
  });

  // Mock data - replace with actual API call
  const mockMessages: Message[] = [
    {
      id: 1,
      sender_id: 101,
      sender_name: 'Sarah Johnson',
      sender_type: 'employer',
      sender_company: 'TechCorp Inc.',
      subject: 'Interview Invitation - Senior Developer Role',
      content: 'Hi! We were impressed with your application and would like to invite you for an interview. Are you available next Tuesday at 2 PM?',
      is_read: false,
      created_at: '2024-01-15T10:30:00Z'
    },
    {
      id: 2,
      sender_id: 102,
      sender_name: 'Mike Chen',
      sender_type: 'employer',
      sender_company: 'StartupXYZ',
      subject: 'Application Status Update',
      content: 'Thank you for your interest in our company. We have reviewed your application and will get back to you within the next week.',
      is_read: true,
      created_at: '2024-01-14T15:45:00Z'
    },
    {
      id: 3,
      sender_id: 103,
      sender_name: 'HR Team',
      sender_type: 'employer',
      sender_company: 'BigTech Solutions',
      subject: 'Follow-up Questions',
      content: 'We have a few additional questions about your experience with React and Node.js. Could you please provide more details about your recent projects?',
      is_read: true,
      created_at: '2024-01-13T09:20:00Z'
    }
  ];

  const messages = mockMessages;
  const unreadCount = messages.filter(m => !m.is_read).length;

  const filteredMessages = messages.filter(message => {
    if (messageFilter === 'unread' && message.is_read) return false;
    if (searchTerm && !message.subject.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !message.sender_name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const handleSendMessage = async () => {
    try {
      // await employeeService.sendMessage(composeData);
      toast.success('Message sent successfully!');
      setShowCompose(false);
      setComposeData({ recipient_id: '', subject: '', content: '' });
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const handleMarkAsRead = async (messageId: number) => {
    try {
      // await employeeService.markMessageAsRead(messageId);
      toast.success('Message marked as read');
    } catch (error) {
      toast.error('Failed to mark message as read');
    }
  };

  const getSenderIcon = (senderType: string) => {
    switch (senderType) {
      case 'employer':
        return <Building className="w-4 h-4" />;
      case 'admin':
        return <Star className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  if (selectedMessage) {
    return (
      <MessageDetailView
        message={selectedMessage}
        onBack={() => setSelectedMessage(null)}
        onMarkAsRead={handleMarkAsRead}
      />
    );
  }

  if (showCompose) {
    return (
      <ComposeMessageView
        composeData={composeData}
        setComposeData={setComposeData}
        onSend={handleSendMessage}
        onCancel={() => setShowCompose(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-1">
            Communication with employers and recruiters
          </p>
        </div>
        <button
          onClick={() => setShowCompose(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Send className="w-4 h-4" />
          Compose
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Messages</p>
              <p className="text-xl font-bold text-gray-900">{messages.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Star className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Unread</p>
              <p className="text-xl font-bold text-gray-900">{unreadCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Building className="w-5 h-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">From Employers</p>
              <p className="text-xl font-bold text-gray-900">
                {messages.filter(m => m.sender_type === 'employer').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search messages..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={messageFilter}
                onChange={(e) => setMessageFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Messages</option>
                <option value="unread">Unread</option>
                <option value="starred">Starred</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {filteredMessages.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredMessages.map((message) => (
              <MessageCard
                key={message.id}
                message={message}
                onClick={() => setSelectedMessage(message)}
                getSenderIcon={getSenderIcon}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm || messageFilter !== 'all' ? 'No messages found' : 'No messages yet'}
            </h3>
            <p className="text-gray-600">
              {searchTerm || messageFilter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Messages from employers and recruiters will appear here'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Message Card Component
interface MessageCardProps {
  message: Message;
  onClick: () => void;
  getSenderIcon: (type: string) => JSX.Element;
}

const MessageCard: React.FC<MessageCardProps> = ({ message, onClick, getSenderIcon }) => {
  return (
    <div
      onClick={onClick}
      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
        !message.is_read ? 'bg-blue-50 border-l-4 border-blue-500' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <div className={`p-2 rounded-lg ${
            message.sender_type === 'employer' ? 'bg-blue-100 text-blue-600' :
            message.sender_type === 'admin' ? 'bg-purple-100 text-purple-600' :
            'bg-gray-100 text-gray-600'
          }`}>
            {getSenderIcon(message.sender_type)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`font-medium ${!message.is_read ? 'font-semibold' : ''}`}>
                {message.sender_name}
              </h3>
              {message.sender_company && (
                <span className="text-sm text-gray-500">• {message.sender_company}</span>
              )}
              {!message.is_read && (
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
            </div>

            <p className={`text-sm mb-2 ${!message.is_read ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
              {message.subject}
            </p>

            <p className="text-sm text-gray-500 line-clamp-2">
              {message.content}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4">
          <div className="text-xs text-gray-500">
            {format(new Date(message.created_at), 'MMM d')}
          </div>
          <button className="p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Message Detail View Component
interface MessageDetailViewProps {
  message: Message;
  onBack: () => void;
  onMarkAsRead: (id: number) => void;
}

const MessageDetailView: React.FC<MessageDetailViewProps> = ({ message, onBack, onMarkAsRead }) => {
  const [replyContent, setReplyContent] = useState('');

  const handleReply = () => {
    toast.success('Reply sent!');
    setReplyContent('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{message.subject}</h1>
          <p className="text-gray-600">
            From {message.sender_name} {message.sender_company && `• ${message.sender_company}`}
          </p>
        </div>
      </div>

      {/* Message Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium">{message.sender_name}</p>
              <p className="text-sm text-gray-500">
                {format(new Date(message.created_at), 'MMMM d, yyyy \'at\' h:mm a')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!message.is_read && (
              <button
                onClick={() => onMarkAsRead(message.id)}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                Mark as Read
              </button>
            )}
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="prose max-w-none">
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        </div>
      </div>

      {/* Reply Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Reply</h3>

        <div className="space-y-4">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Type your reply..."
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                <Paperclip className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                <Smile className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleReply}
              disabled={!replyContent.trim()}
              className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              Send Reply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Compose Message View Component
interface ComposeMessageViewProps {
  composeData: any;
  setComposeData: (data: any) => void;
  onSend: () => void;
  onCancel: () => void;
}

const ComposeMessageView: React.FC<ComposeMessageViewProps> = ({
  composeData,
  setComposeData,
  onSend,
  onCancel
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Compose Message</h1>
      </div>

      {/* Compose Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipient
            </label>
            <input
              type="text"
              value={composeData.recipient_id}
              onChange={(e) => setComposeData(prev => ({ ...prev, recipient_id: e.target.value }))}
              placeholder="Search for employer or recruiter..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <input
              type="text"
              value={composeData.subject}
              onChange={(e) => setComposeData(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="Enter subject..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              value={composeData.content}
              onChange={(e) => setComposeData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Type your message..."
              rows={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                <Paperclip className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onSend}
                disabled={!composeData.subject.trim() || !composeData.content.trim()}
                className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                Send Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};