
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon?: React.ReactNode;
    unit?: string;
}

const Input: React.FC<InputProps> = ({ label, icon, unit, ...props }) => {
    return (
        <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
            <div className="flex items-center">
                {icon && <span className="absolute left-3 text-gray-400">{icon}</span>}
                <input
                    {...props}
                    className={`block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${icon ? 'pl-10' : ''} ${unit ? 'pr-12' : ''}`}
                />
                {unit && <span className="absolute right-3 text-gray-500 dark:text-gray-400 text-sm">{unit}</span>}
            </div>
        </div>
    );
};

export default Input;
