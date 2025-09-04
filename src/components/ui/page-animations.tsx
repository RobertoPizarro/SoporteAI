"use client";

import React from 'react';

const PageAnimations: React.FC = () => {
    return (
        <style jsx>{`
      .animate-fade-in-down {
        animation: fadeInDown 0.6s ease-out forwards;
        opacity: 0;
        transform: translateY(-20px);
      }

      @keyframes fadeInDown {
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes slideInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .animate-slideInUp {
        animation: slideInUp 0.4s ease-out;
      }
    `}</style>
    );
};

export default PageAnimations;