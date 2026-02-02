import Image from 'next/image';
import React from 'react';
import { FaSmile, FaMicrochip, FaCamera, FaChevronRight } from 'react-icons/fa';

export default function TelegramCategories() {
    const topCategories = [
        {
            icon: <FaSmile className="w-6 h-6 text-accent-primary" />,
            title: 'Entertainment',
            count: '341 Media'
        },
        {
            icon: <FaMicrochip className="w-6 h-6 text-accent-primary" />,
            title: 'Technology',
            count: '470 Media'
        },
        {
            icon: <FaCamera className="w-6 h-6 text-accent-primary" />,
            title: 'Photo',
            count: '146 Media'
        }
    ];

    const bottomCategories = [
        {
            image: 'https://telegramchannels.me/images/satellite.svg',
            title: 'Channels',
            count: '7,331',
            subCount: '1.15Bn'
        },
        {
            image: 'https://telegramchannels.me/images/networking.svg',
            title: 'Groups',
            count: '1,383',
            subCount: '5.99M'
        },
        {
            image: 'https://telegramchannels.me/images/robot.svg',
            title: 'Bots',
            count: '1,533',
            subCount: ''
        },
        {
            image: 'https://telegramchannels.me/images/moon.svg',
            title: 'Stickers',
            count: '1,306',
            subCount: ''
        }
    ];

    return (
        <div className="w-full max-w-[1344px] mx-auto px-4 md:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {topCategories.map((category, index) => (
                    <div
                        key={index}
                        className="bg-secondary-dark border border-white/6 rounded-lg p-5 transition-all duration-300 hover:border-white/12 cursor-pointer group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="bg-primary-dark rounded-lg p-3 group-hover:bg-accent-primary/10 transition-colors duration-300">
                                {category.icon}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-medium text-text-primary mb-0.5">
                                    {category.title}
                                </h3>
                                <p className="text-text-muted text-sm">{category.count}</p>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Categories Button */}
                <div className="bg-secondary-dark border border-white/6 rounded-lg p-5 transition-all duration-300 hover:border-accent-primary/50 cursor-pointer flex items-center justify-center group">
                    <div className="text-center flex items-center gap-3">
                        <h3 className="text-lg font-medium text-text-primary">All Categories</h3>
                        <FaChevronRight className="w-4 h-4 text-text-muted group-hover:text-accent-primary group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {bottomCategories.map((category, index) => (
                    <div
                        key={index}
                        className="relative bg-secondary-dark border border-white/6 rounded-lg p-5 overflow-hidden transition-all duration-300 hover:border-white/12 cursor-pointer"
                    >
                        <div className="absolute -top-4 -left-8 opacity-20">
                            <Image
                                width={80}
                                height={80}
                                src={category.image}
                                alt={category.title}
                                className="object-contain"
                                unoptimized
                            />
                        </div>
                        <div className="flex items-center justify-center flex-col gap-1 relative z-10">
                            <h3 className="text-lg font-medium text-text-primary">
                                {category.title}
                            </h3>
                            <div className="flex items-center gap-2">
                                <p className="text-accent-primary font-semibold text-xl">
                                    {category.count}
                                </p>
                                {category.subCount && (
                                    <>
                                        <span className="text-text-muted/40">/</span>
                                        <p className="text-text-muted text-sm">{category.subCount}</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
