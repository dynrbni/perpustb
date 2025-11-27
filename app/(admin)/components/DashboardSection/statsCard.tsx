"use client";
import React, { useState, useEffect } from 'react';
import { Book, BookOpen, Users, TrendingUp } from 'lucide-react';

export const StatsCard = ({ icon: Icon, title, value, trend, trendValue, color, loading }: {
  icon: React.ElementType;
  title: string;
  value: string | number;
  trend?: string;
  trendValue?: string;
  color: string;
  loading?: boolean;
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all p-6 border border-gray-100">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-medium mb-2">{title}</p>
          {loading ? (
            <div className="h-9 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
          ) : (
            <h3 className="text-4xl font-bold text-gray-900 mb-3">{value}</h3>
          )}
        </div>
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
          <Icon size={30} className="text-white" />
        </div>
      </div>
    </div>
  );
};