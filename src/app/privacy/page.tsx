"use client";

import { Logo } from "@/components/ui/Logo";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/layout/Footer";

export default function PrivacyPage() {
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
                        <h1 className="text-3xl font-bold text-gray-900 mb-6">개인정보처리방침</h1>
                        <p className="text-gray-500 text-sm">최종 수정일: 2026년 1월 9일</p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-900 border-b pb-2">1. 개인정보의 수집 및 보관 방식</h2>
                        <div className="text-gray-600 text-sm leading-relaxed space-y-4">
                            <p>
                                자소서 뚝딱(이하 "서비스")은 사용자의 기본권과 프라이버시를 최우선으로 생각하며, 불필요한 개인정보 상시 저장을 지양합니다.
                            </p>
                            <div className="bg-blue-50 p-6 rounded-2xl">
                                <p className="font-bold text-blue-900 mb-2">💡 철저한 로컬 보안 원칙</p>
                                <ul className="list-disc list-inside space-y-2 text-blue-800">
                                    <li>인터뷰 과정에서 입력하시는 모든 정보는 <strong>사용자의 기기 브라우저(Local Storage)</strong>에만 임시로 저장됩니다.</li>
                                    <li>결제 단계로 진입하기 전까지 어떠한 정보도 회사의 서버로 전송되거나 기록되지 않습니다.</li>
                                    <li>결제하지 않고 사이트를 종료하거나 '종료하기' 버튼을 누르시는 경우, 브라우저에 남은 데이터는 즉시 파기됩니다.</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-900 border-b pb-2">2. 결제 이용 시 정보 보관 및 이용</h2>
                        <div className="text-gray-600 text-sm leading-relaxed space-y-4">
                            <p>
                                서비스를 결제하여 이용하시는 경우, 원활한 서비스 제공 및 사후 관리(환불, 민원 처리 등)를 위해 다음과 같이 제한적으로 정보를 보관할 수 있습니다.
                            </p>
                            <ul className="list-disc list-inside space-y-2 pl-2">
                                <li><strong>보관 항목</strong>: AI에 전달되는 인터뷰 텍스트 로그, 결제 정보</li>
                                <li><strong>보관 기간</strong>: <strong>영업일 기준 3일 ~ 7일</strong></li>
                                <li><strong>보관 목적</strong>: 결과물 생성 오류 확인, 환불 요청에 따른 사유 검토 등 고객 지원 대응</li>
                                <li><strong>파기 방법</strong>: 보관 기간 종료 후 서버에서 즉시 자동 파기됩니다.</li>
                            </ul>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-900 border-b pb-2">3. 개인정보의 제3자 제공 (AI 엔진)</h2>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            본 서비스는 AI 초안 생성을 위해 앤스로픽(Anthropic) 사의 AI 모델을 사용합니다. 생성 과정에서 텍스트 데이터가 전송되나, 이는 익명화된 상태로 전달되며 해당 데이터는 <strong>AI 모델의 학습 용도로 사용되지 않도록 설정</strong>되어 있습니다.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-900 border-b pb-2">4. 개인정보 보호책임자</h2>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            서비스 이용 중 개인정보 관련 문의사항이 있으시면 아래로 연락해 주시기 바랍니다.
                            <br /><br />
                            • 이메일: smilelee9@naver.com
                            <br />
                            • 연락처: 010-2871-2980
                        </p>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
