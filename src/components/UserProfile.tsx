import React from 'react';
import { User, Mail, Phone, MapPin, Heart, Briefcase, DollarSign, Edit } from 'lucide-react';
import { UserProfile as UserProfileType } from '../types';

interface UserProfileProps {
  profile: UserProfileType;
  onEdit: () => void;
}

export function UserProfile({ profile, onEdit }: UserProfileProps) {
  return (
    <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <User className="text-blue-600" size={24} />
          Welcome, {profile.firstName}!
        </h3>
        <button
          onClick={onEdit}
          className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
        >
          <Edit size={16} />
          Edit Profile
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <Mail size={16} className="text-gray-500" />
          <span className="text-gray-700">{profile.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone size={16} className="text-gray-500" />
          <span className="text-gray-700">{profile.phoneNumber}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-gray-500" />
          <span className="text-gray-700">{profile.zipCode}</span>
        </div>
        <div className="flex items-center gap-2">
          <Heart size={16} className="text-gray-500" />
          <span className="text-gray-700 capitalize">{profile.relationshipStatus.replace('-', ' ')}</span>
        </div>
        <div className="flex items-center gap-2">
          <Briefcase size={16} className="text-gray-500" />
          <span className="text-gray-700">{profile.occupation}</span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign size={16} className="text-gray-500" />
          <span className="text-gray-700">${profile.salary.toLocaleString()}/year</span>
        </div>
      </div>
    </div>
  );
}