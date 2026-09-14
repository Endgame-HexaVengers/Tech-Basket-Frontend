'use client';

import React, { useState, useRef } from 'react';
import { Card, Button, Avatar, TextField, Input, Label } from '@heroui/react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export const ProfileSection: React.FC = () => {
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('admin@inventory.com');
  const [avatarUrl, setAvatarUrl] = useState('https://i.pravatar.cc/150?u=a042581f4e29026704d');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // ImgBB Upload Handler
  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file.');
      return;
    }

    const toastId = toast.loading('Uploading avatar to ImgBB...');
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
      if (!apiKey) {
        toast.error('ImgBB API key is missing in environment variables.', { id: toastId });
        setIsUploading(false);
        return;
      }

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setAvatarUrl(data.data.url);
        toast.success('Avatar uploaded successfully!', { id: toastId });
      } else {
        toast.error(data.error?.message || 'Failed to upload image.', { id: toastId });
      }
    } catch (error) {
      console.error('ImgBB Upload Error:', error);
      toast.error('An error occurred while uploading the image.', { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  // Save Profile Handler
  const handleSaveProfile = async () => {
    setIsSaving(true);
    const toastId = toast.loading('Updating profile settings...');

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, avatarUrl }),
      });

      if (res.ok) {
        toast.success('Profile details updated successfully!', { id: toastId });
      } else {
        toast.error('Failed to update profile settings.', { id: toastId });
      }
    } catch (error) {
      console.error('Save Profile Error:', error);
      toast.error('Something went wrong while saving.', { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="p-6 border border-default-200 bg-background shadow-sm rounded-xl">
        <div className="flex flex-col gap-1 mb-6">
          <h2 className="text-xl font-bold tracking-tight">Profile Settings</h2>
          <p className="text-sm text-default-500">
            Manage your personal profile details and avatar.
          </p>
        </div>

        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleImageChange} 
          accept="image/*" 
          className="hidden" 
        />

        <div className="flex items-center gap-4 mb-6">
          <Avatar className="w-20 h-20 border-2 border-primary rounded-full overflow-hidden">
            <Avatar.Image src={avatarUrl} alt="User Avatar" />
            <Avatar.Fallback>JD</Avatar.Fallback>
          </Avatar>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleButtonClick}
            isDisabled={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Change Avatar'}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField>
            <Label className="text-sm font-medium mb-1 block">Full Name</Label>
            <Input 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:border-primary"
            />
          </TextField>

          <TextField>
            <Label className="text-sm font-medium mb-1 block">Email Address</Label>
            <Input 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:border-primary"
            />
          </TextField>
        </div>

        <div className="flex justify-end mt-6">
          <Button variant="primary" onClick={handleSaveProfile} isDisabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};