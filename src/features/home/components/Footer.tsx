// src/components/home/Footer.tsx
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export const Footer = () => (
  <footer className="mt-12 border-t border-white/5">
    <div className="container mx-auto px-6 py-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <h3 className="text-xl font-black bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-3">
            دسیندریا
          </h3>
          <p className="text-white/40 text-sm leading-relaxed">
            بهترین پلتفرم تماشای انیمه با زیرنویس فارسی
          </p>
        </div>

        {/* Links */}
        {[
          { title: 'دسترسی سریع', links: ['خانه', 'انیمه‌ها', 'موزیک', 'اخبار'] },
          { title: 'پشتیبانی', links: ['تماس با ما', 'سوالات متداول', 'قوانین', 'حریم خصوصی'] },
          { title: 'شبکه‌های اجتماعی', links: ['تلگرام', 'اینستاگرام', 'دیسکورد', 'توییتر'] },
        ].map(section => (
          <div key={section.title}>
            <h4 className="text-white/70 text-sm font-semibold mb-3">{section.title}</h4>
            <ul className="space-y-2">
              {section.links.map(link => (
                <li key={link}>
                  <a href="#" className="text-white/40 text-sm hover:text-cyan-400 transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom */}
      <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="text-white/30 text-xs">
          © ۱۴۰۵ دسیندریا. تمامی حقوق محفوظ است.
        </p>
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-white/30 text-xs flex items-center gap-1"
        >
          ساخته شده با <Heart className="w-3 h-3 text-pink-500 fill-pink-500" /> برای انیمه‌دوستان
        </motion.p>
      </div>
    </div>
  </footer>
);
