import React from 'react';

export const ProfileSkeleton = () => {
  return (
    <div className="animate-pulse space-y-6 p-4 max-w-4xl mx-auto">
      <div className="flex flex-col items-center">
        <div className="w-32 h-32 bg-slate-200 rounded-full mb-4"></div>
        <div className="h-6 w-48 bg-slate-200 rounded mb-2"></div>
        <div className="h-4 w-32 bg-slate-200 rounded"></div>
      </div>
      <div className="space-y-3">
        <div className="h-4 w-full bg-slate-200 rounded"></div>
        <div className="h-4 w-5/6 bg-slate-200 rounded"></div>
        <div className="h-4 w-4/6 bg-slate-200 rounded"></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="h-20 bg-slate-200 rounded-xl"></div>
        <div className="h-20 bg-slate-200 rounded-xl"></div>
      </div>
    </div>
  );
};
