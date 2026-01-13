
import React from 'react';

interface ToggleProps {
    label: string;
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    name: string;
}

const Toggle: React.FC<ToggleProps> = ({ label, checked, onChange, name }) => {
    return (
        <label htmlFor={name} className="flex items-center cursor-pointer">
            <div className="relative">
                <input type="checkbox" id={name} name={name} className="sr-only" checked={checked} onChange={onChange} />
                <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${checked ? 'transform translate-x-full bg-blue-500' : ''}`}></div>
            </div>
            <div className="ml-3 text-gray-700 dark:text-gray-300 font-medium">
                {label}
            </div>
        </label>
    );
};

export default Toggle;
