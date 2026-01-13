
import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    icon?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, className, title, icon }) => {
    return (
        <div className={`bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 ${className}`}>
            {title && (
                <div className="flex items-center mb-4">
                    {icon && <span className="mr-3 text-blue-500">{icon}</span>}
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
                </div>
            )}
            {children}
        </div>
    );
};

export default Card;
