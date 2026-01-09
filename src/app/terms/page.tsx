"use client";

import { Logo } from "@/components/ui/Logo";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/layout/Footer";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="border-b border-gray-100 bg-white/50 backdrop-blur-md sticky top-0 z-10">
                <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/">
                        <Logo />
                    </Link>
                    <Link href="/" className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-1">
                        <ArrowLeft className="w-4 h-4" /> 홈으로
                    </Link>
                </div>
            </header>

            <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-12">
                <div className="bg-white rounded-[24px] border border-gray-100 p-8 md:p-12 shadow-sm space-y-10">
                    <section>
                        <h1 className="text-3xl font-bold text-gray-900 mb-6">서비스 이용약관 및 환불 규정</h1>
                        <p className="text-gray-500 text-sm">최종 수정일: 2026년 1월 8일</p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-900 border-b pb-2">제1조 (목적)</h2>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            본 약관은 리소프트(이하 "회사")가 제공하는 자소서 뚝딱 서비스(이하 "서비스")의 이용과 관련하여 회사와 회원의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-900 border-b pb-2">제2조 (환불 규정)</h2>
                        <div className="text-gray-600 text-sm leading-relaxed space-y-4">
                            <div>
                                <p className="font-bold text-gray-900 mb-2">1. 서비스 특성에 따른 환불 제한</p>
                                <p>본 서비스는 결제 즉시 AI가 개인화된 콘텐츠를 생성하여 제공하는 디지털 콘텐츠 서비스입니다. 전자상거래 등에서의 소비자보호에 관한 법률 제17조 제2항 제5호에 따라, 디지털 콘텐츠의 제공이 개시된 경우(결제 후 결과물을 확인한 경우)에는 청약철회(환불)가 제한됩니다.</p>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-2xl space-y-4">
                                <div>
                                    <p className="font-bold text-gray-900 flex items-center gap-2 mb-3">
                                        <span className="text-blue-600">✅</span> 전액 환불이 가능한 구체적 사례
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 pl-2">
                                        <li><strong>시스템 오류</strong>: 결제가 완료되었음에도 서버 오류로 인해 결과물 확인 페이지로 진입하지 못한 경우</li>
                                        <li><strong>기술적 결함</strong>: AI 생성 과정에서 중단되어 문장이 끊기거나, 텍스트가 아닌 깨진 코드가 출력된 경우</li>
                                        <li><strong>중복 결제</strong>: 네트워크 지연 등으로 인해 동일한 주문 번호가 중복 결제된 경우</li>
                                        <li><strong>미열람 상태</strong>: 결제 직후 결과물을 확인하지 않은 상태에서 1시간 이내에 환불을 요청하는 경우</li>
                                    </ul>
                                </div>

                                <div className="pt-2 border-t border-gray-100">
                                    <p className="font-bold text-gray-900 flex items-center gap-2 mb-3">
                                        <span className="text-red-500">❌</span> 환불이 불가능한 구체적 사례
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 pl-2">
                                        <li><strong>주관적 불만족</strong>: "문체성향이 생각과 다르다", "내용이 마음에 들지 않는다" 등 결과물의 질에 대한 주관적인 판단인 경우</li>
                                        <li><strong>사용자 과실</strong>: 오타 입력, 잘못된 경험 정보 입력, 질문과 무관하거나 의미 없는 내용(문자 나열 등) 입력으로 인해 결과물이 부정확하게 생성된 경우</li>
                                        <li><strong>단순 변심</strong>: 결과물을 이미 확인(열람 및 복사)한 후, 더 이상 필요하지 않게 되어 환불을 요청하는 경우</li>
                                        <li><strong>경미한 결함</strong>: AI 생성 특성상 발생할 수 있는 사소한 오탈자, 맞춤법 오류 등 서비스 이용에 중대한 지장을 주지 않는 수준인 경우</li>
                                        <li><strong>기기 호환성</strong>: 사용자 본인의 인터넷 환경 불안정이나 권장하지 않는 브라우저 사용으로 발생한 일시적 오류인 경우</li>
                                    </ul>
                                </div>
                            </div>

                            <div>
                                <p className="font-bold text-gray-900 mb-2">2. 환불 절차</p>
                                <p>환불 요청은 이메일(smilelee9@naver.com)을 통해 접수하며, 회사는 사유를 검토한 후 영업일 기준 5일 이내에 환불 처리를 진행합니다. (결제 수단 및 카드사에 따라 환불 완료까지의 기간은 상이할 수 있습니다.)</p>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-900 border-b pb-2">제3조 (사업자 정보)</h2>
                        <ul className="text-gray-600 text-sm space-y-1 list-disc list-inside bg-gray-50 p-6 rounded-xl">
                            <li><strong>상호명</strong>: 리소프트</li>
                            <li><strong>대표자</strong>: 이승우</li>
                            <li><strong>사업자등록번호</strong>: 419-37-01612</li>
                            <li><strong>주소</strong>: 서울특별시 양천구 지양로9길 23</li>
                            <li><strong>연락처</strong>: smilelee9@naver.com | 010-2871-2980</li>
                        </ul>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
