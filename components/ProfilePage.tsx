import { User } from '../app/page';
import { Mail, Phone, MapPin, Calendar, Briefcase } from 'lucide-react';

interface ProfilePageProps {
  user: User;
}

export function ProfilePage({ user }: ProfilePageProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
       
        
        <div className="px-8 pb-8">
          
          <div className="flex items-center  grid grid-cols-1 md:grid-cols-2 gap-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 pl-10  m-5 w-cover shadow-lg rounded-2xl object-cover ">
            <img
              src={user.picture || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop'}
              alt={user.name}
              className="w-32 h-32 rounded-2xl object-cover mt-3 mb-3 border-4 border-white shadow-lg"
              
            />
            <div className="pb-4">
              <h1 className="text-white">{user.name}</h1>
              <p className="text-white">{user.position}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-gray-900 mb-4">Contact Information</h2>
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">User Name</p>
                  <p className="text-gray-900">{user.user_name}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Phone</p>
                  <p className="text-gray-900">{user.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Location</p>
                  <p className="text-gray-900">{user.location}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-gray-900 mb-4">Personal Details</h2>
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Age</p>
                  <p className="text-gray-900">{user.age} years</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Position</p>
                  <p className="text-gray-900">{user.position}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Address</p>
                  <p className="text-gray-900">{user.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
