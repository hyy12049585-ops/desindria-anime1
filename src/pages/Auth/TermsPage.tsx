import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, ChevronUp, ScrollText } from 'lucide-react';

const termsData = [
  {
    title: '۱. تعریف خدمات',
    content:
      'سیندریا یک پلتفرم پخش آنلاین ویدیو است که امکان تماشای فیلم، سریال، انیمیشن و مستند را برای کاربران فراهم می‌کند. این خدمات شامل پخش زنده، دانلود آفلاین و پیشنهادات هوشمند بر اساس سلیقه کاربر می‌باشد.',
  },
  {
    title: '۲. شرایط عضویت',
    content:
      'برای استفاده از خدمات سیندریا، کاربران باید حداقل ۱۳ سال سن داشته باشند و اطلاعات صحیح و معتبر را هنگام ثبت‌نام ارائه دهند. هر فرد تنها مجاز به داشتن یک حساب کاربری است و مسئولیت حفظ امنیت حساب خود را بر عهده دارد.',
  },
  {
    title: '۳. حریم خصوصی',
    content:
      'سیندریا متعهد به حفظ حریم خصوصی کاربران است. اطلاعات شخصی شما تنها برای ارائه خدمات بهتر استفاده می‌شود و بدون رضایت شما با اشخاص ثالث به اشتراک گذاشته نخواهد شد. ما از رمزنگاری پیشرفته برای محافظت از داده‌های شما استفاده می‌کنیم.',
  },
  {
    title: '۴. مالکیت محتوا',
    content:
      'تمامی محتوای ارائه شده در سیندریا شامل فیلم‌ها، سریال‌ها، تصاویر و متون تحت حمایت قوانین مالکیت معنوی قرار دارند و هرگونه کپی‌برداری، ضبط صفحه، توزیع یا بازنشر غیرمجاز ممنوع است و پیگرد قانونی دارد.',
  },
  {
    title: '۵. شرایط اشتراک',
    content:
      'اشتراک‌های سیندریا به صورت دوره‌ای (ماهانه، سه‌ماهه یا سالانه) ارائه می‌شوند. تمدید اشتراک به صورت خودکار انجام می‌شود مگر اینکه کاربر حداقل ۲۴ ساعت قبل از پایان دوره آن را لغو کند. بازپرداخت وجه تنها در شرایط خاص و با بررسی تیم پشتیبانی امکان‌پذیر است.',
  },
  {
    title: '۶. محدودیت مسئولیت',
    content:
      'سیندریا تلاش می‌کند خدمات خود را بدون وقفه ارائه دهد، اما مسئولیتی در قبال قطعی‌های موقت ناشی از مشکلات فنی، بروزرسانی سیستم یا حوادث غیرمترقبه ندارد. کیفیت پخش ممکن است بسته به سرعت اینترنت کاربر متفاوت باشد.',
  },
  {
    title: '۷. قوانین استفاده',
    content:
      'کاربران موظف‌اند از خدمات سیندریا به صورت قانونی استفاده کنند. هرگونه سوءاستفاده، هک، تلاش برای دور زدن سیستم‌های امنیتی، اشتراک‌گذاری حساب با افراد غیرمجاز یا استفاده از VPN برای دور زدن محدودیت‌های جغرافیایی منجر به مسدود شدن دائمی حساب کاربری خواهد شد.',
  },
  {
    title: '۸. تغییرات قوانین',
    content:
      'سیندریا حق تغییر این قوانین و مقررات را در هر زمان برای خود محفوظ می‌دارد. تغییرات مهم از طریق ایمیل، پیامک یا اعلان درون‌برنامه‌ای اطلاع‌رسانی خواهد شد. ادامه استفاده از خدمات پس از اعمال تغییرات به منزله پذیرش قوانین جدید است.',
  },
];

const TermsPage: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleSection = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 relative overflow-hidden">
      {/* دایره‌های تزئینی */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-200 to-purple-300 rounded-full opacity-30 blur-3xl animate-pulse" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-100 to-purple-200 rounded-full opacity-25 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      {/* الگوی نقطه‌ای */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle, #7c3aed 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div
        className={`relative z-10 max-w-2xl mx-auto px-4 py-10 transition-all duration-700 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* هدر */}
        <div className="text-center mb-10">
          <Link to="/auth/login" className="inline-block mb-5">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 via-purple-500 to-purple-400 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-purple-300/50 rotate-3 hover:rotate-0 transition-transform duration-300">
                <span className="text-white text-3xl font-extrabold tracking-tight">S</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-purple-400 to-purple-300 rounded-lg opacity-60 blur-sm" />
            </div>
          </Link>
          <h1 className="text-2xl font-extrabold text-gray-800 mb-2 flex items-center justify-center gap-2">
            <ScrollText size={24} className="text-purple-500" />
            قوانین و مقررات سیندریا
          </h1>
          <p className="text-gray-400 text-sm">
            لطفاً قبل از استفاده از خدمات، قوانین زیر را با دقت مطالعه کنید.
          </p>
        </div>

        {/* بخش‌های قوانین — آکاردئونی */}
        <div className="space-y-3">
          {termsData.map((section, idx) => (
            <div
              key={idx}
              className={`bg-white/80 backdrop-blur-sm rounded-2xl border transition-all duration-300 overflow-hidden ${
                expandedIndex === idx
                  ? 'border-purple-200 shadow-md shadow-purple-100/40'
                  : 'border-gray-100 shadow-sm hover:border-purple-100 hover:shadow-md hover:shadow-purple-50/30'
              }`}
            >
              <button
                onClick={() => toggleSection(idx)}
                className="w-full flex items-center justify-between p-5 text-right"
              >
                <h2 className="text-base font-bold text-purple-700">{section.title}</h2>
                <div
                  className={`text-purple-400 transition-transform duration-300 ${
                    expandedIndex === idx ? 'rotate-180' : ''
                  }`}
                >
                  {expandedIndex === idx ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </button>
              <div
                className={`transition-all duration-300 ease-in-out ${
                  expandedIndex === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-5 pb-5 pt-0">
                  <div className="w-full h-px bg-gradient-to-l from-transparent via-purple-200 to-transparent mb-4" />
                  <p className="text-sm text-gray-600 leading-8">{section.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* نوار پایین */}
        <div className="mt-10 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-center text-sm text-gray-500 mb-5 leading-6">
            با ثبت‌نام در سیندریا، شما تمامی قوانین و مقررات بالا را مطالعه کرده و می‌پذیرید.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/auth/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-white font-bold bg-gradient-to-l from-purple-600 via-purple-500 to-purple-400 shadow-lg shadow-purple-300/40 hover:shadow-purple-400/50 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200"
            >
              <span>شروع ثبت‌نام</span>
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/auth/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-purple-600 font-bold bg-purple-50 border border-purple-100 hover:bg-purple-100 transition-all duration-200"
            >
              <span>بازگشت به ورود</span>
            </Link>
          </div>
        </div>

        {/* فوتر */}
        <p className="text-center text-xs text-gray-400 mt-8">
          آخرین بروزرسانی: فروردین ۱۴۰۵
        </p>
      </div>
    </div>
  );
};

export default TermsPage;
