"use client";


import { Button } from "@/components/ui/Button";
import { ArrowRight, Check, HelpCircle, X } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Logo } from "@/components/ui/Logo";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-[radial-gradient(#E5E7EB_1px,transparent_1px)] bg-[size:24px_24px]">
      {/* Navbar */}
      <header className="w-full max-w-5xl px-6 py-6 flex justify-between items-center">
        <Logo />
        <nav className="text-sm text-gray-500 hidden sm:block font-medium">
          커피 한 잔 값으로 끝내는 자소서 초안
        </nav>
      </header>

      {/* Hero */}
      <main className="flex-1 w-full max-w-4xl px-6 flex flex-col justify-center items-center text-center mt-12 mb-20 space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-6"
        >
          <span className="inline-block py-1.5 px-4 rounded-full bg-blue-50 text-blue-600 text-xs font-bold tracking-wide mb-2 shadow-sm border border-blue-100">
            나만의 고품질 자소서 초안을 즉시 만나보세요
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1] text-gray-900 break-keep">
            글을 쓰지 않아도,<br className="hidden sm:block" />
            <span className="text-primary relative inline-block">
              질문에 답하다 보면
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-blue-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
              </svg>
            </span> 초안이 완성됩니다.
          </h1>
          <p className="text-lg sm:text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto break-keep">
            막막한 자소서, 어떤 것부터 해야 할지 더 이상 고민하지 마세요.<br />
            질문에 대답만 하면 10분 만에 사람 냄새 나는 초안을 뚝딱 만들어 드립니다.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="flex flex-col items-center space-y-4"
        >
          <Link href="/interview">
            <Button size="lg" className="rounded-full h-14 px-10 text-lg font-bold shadow-xl shadow-blue-500/20 hover:shadow-blue-500/30 transition-all">
              지금 바로 인터뷰 시작하기 <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <p className="text-sm text-gray-400 font-medium italic">
            * 모든 질문에 답변하면 AI 초안 미리보기가 제공됩니다.
          </p>
        </motion.div>
      </main>

      {/* FAQ / Targets */}
      <section className="w-full max-w-5xl px-6 py-20 border-t border-gray-100 bg-white/30 backdrop-blur-md">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 inline-flex items-center gap-2">
            <HelpCircle className="text-blue-600 w-8 h-8" /> 누구에게 적합한가요?
          </h2>
          <p className="text-gray-500">당신의 상황에 맞는지 확인해보세요.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-blue-100 shadow-sm space-y-4">
            <h3 className="text-xl font-bold text-blue-600 flex items-center gap-2">
              <Check className="w-6 h-6" /> 이런 분들께 추천해요
            </h3>
            <ul className="space-y-4 pt-4">
              <li className="flex items-start gap-3 text-gray-700 font-medium">
                <div className="mt-1 w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-blue-600" />
                </div>
                자소서를 쓰기 시작해서 어떤 것부터 해야 할지 막막한 사람
              </li>
              <li className="flex items-start gap-3 text-gray-700 font-medium">
                <div className="mt-1 w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-blue-600" />
                </div>
                프로젝트 경험은 있는데 문장으로 풀어내기가 힘든 사람
              </li>
              <li className="flex items-start gap-3 text-gray-700 font-medium">
                <div className="mt-1 w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-blue-600" />
                </div>
                남들과 다른, 솔직하고 사람 냄새 나는 초안을 원하는 사람
              </li>
            </ul>
          </div>

          <div className="bg-gray-50/50 p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4 opacity-70">
            <h3 className="text-xl font-bold text-gray-500 flex items-center gap-2">
              <X className="w-6 h-6" /> 이런 분들께는 권하지 않아요
            </h3>
            <ul className="space-y-4 pt-4">
              <li className="flex items-start gap-3 text-gray-400">
                <div className="mt-1 w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <X className="w-3 h-3 text-gray-400" />
                </div>
                없는 이야기를 지어내거나 과장해서 쓰고 싶은 사람
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <div className="mt-1 w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <X className="w-3 h-3 text-gray-400" />
                </div>
                이미 작성 완료했고 문장 스타일만 다듬고 싶은 사람
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <div className="mt-1 w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <X className="w-3 h-3 text-gray-400" />
                </div>
                전문적인 첨삭이나 합격 보장 컨설팅을 찾는 사람
              </li>
            </ul>
          </div>
        </div>

        {/* Detailed Q&A */}
        <div className="mt-24 max-w-3xl mx-auto space-y-12">
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-gray-900 flex items-center gap-2 leading-tight">
              <span className="text-blue-600">Q.</span> 그냥 챗GPT를 쓰면 되는 것 아닌가요?
            </h4>
            <p className="text-gray-600 leading-relaxed break-keep">
              맞습니다. GPT로도 자소서를 빨리 쓸 수는 있습니다. 하지만 많은 분들이 <strong>"자소서에 어떤 내용을 넣어야 할지"</strong> 몰라 막막해하며, 결국 추상적이고 모호한 클리셰 표현들만 반복하게 됩니다.
            </p>
            <p className="text-gray-600 leading-relaxed break-keep">
              자소서 뚝딱은 <strong>구체적인 객관식 위주의 인터뷰</strong>를 통해 고객님의 숨겨진 경험과 성향을 아주 세밀하게 파악합니다. 결과적으로 직접 경험한 사실만을 토대로 높은 해상도의 문장을 만들어내기에, 직접 쓴 것과 다름없는 고품질의 결과물을 압도적으로 빠르게 얻을 수 있습니다.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-xl font-bold text-gray-900 flex items-center gap-2 leading-tight">
              <span className="text-blue-600">Q.</span> AI 탐지기에 걸리지는 않을까요?
            </h4>
            <p className="text-gray-600 leading-relaxed break-keep">
              최근 기업과 대학이 AI 사용을 인지하고 있기에, AI가 쓴 글을 그대로 제출할 경우 <strong>100% 안전하다고 장담할 수는 없습니다.</strong>
            </p>
            <p className="text-gray-600 leading-relaxed break-keep">
              그래서 저희는 <strong>'사람이 쓴 정도의 퀄리티를 가진 초안'</strong>을 제공하는 것을 목표로 합니다. 자소서 뚝딱이 만들어드린 초안을 출발점 삼아 본인의 언어로 조금만 수정해 보세요. 혼자 고군분투하거나 일반 GPT를 사용할 때보다 훨씬 짧은 시간 안에 압도적인 퀄리티의 최종본을 완성하실 수 있습니다.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer className="bg-white/50 backdrop-blur-sm" />
    </div>
  );
}
