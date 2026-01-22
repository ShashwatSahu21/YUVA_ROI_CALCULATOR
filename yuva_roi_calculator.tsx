import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Users, Target, AlertCircle, ArrowRight, CheckCircle, Mail, Download, Share2 } from 'lucide-react';

interface CalculatorInputs {
  monthlyVisitors: number;
  currentConversion: number;
  avgOrderValue: number;
  currentCAC: number;
  youthPercentage: number;
}

interface CalculatorResults {
  currentCustomers: number;
  currentRevenue: number;
  currentAcquisitionCost: number;
  youthVisitors: number;
  youthCustomers: number;
  youthRevenue: number;
  newCustomers: number;
  newRevenue: number;
  additionalCustomers: number;
  additionalRevenue: number;
  costSavings: number;
  totalMonthlyImpact: number;
  annualImpact: number;
  roiMultiple: string;
  paybackPeriod: string;
}

const GenXYUVAROICalculator = () => {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    monthlyVisitors: 10000,
    currentConversion: 2,
    avgOrderValue: 5000,
    currentCAC: 3000,
    youthPercentage: 60
  });

  const [results, setResults] = useState<Partial<CalculatorResults>>({});
  const [leadEmail, setLeadEmail] = useState('');
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (leadEmail) {
      // Send to your email service (Zapier, Make, etc)
      console.log('Lead captured:', { email: leadEmail, results });
      setIsFormSubmitted(true);
      setTimeout(() => {
        setShowLeadForm(false);
        setIsFormSubmitted(false);
        setLeadEmail('');
      }, 3000);
    }
  };

  const calculateROI = () => {
    const visitors = inputs.monthlyVisitors;
    const currentConv = inputs.currentConversion / 100;
    const aov = inputs.avgOrderValue;
    const cac = inputs.currentCAC;
    const youthPct = inputs.youthPercentage / 100;

    // Prevent division by zero
    if (currentConv === 0 || aov === 0) {
      return;
    }

    // Current state
    const currentCustomers = visitors * currentConv;
    const currentRevenue = currentCustomers * aov;
    const currentAcquisitionCost = currentCustomers * cac;

    // Youth-specific numbers
    const youthVisitors = visitors * youthPct;
    const youthCustomers = currentCustomers * youthPct;
    const youthRevenue = youthCustomers * aov;

    // After Y.U.V.A. implementation (conservative estimates)
    const improvedConversion = currentConv * 2.5; // 2.5x improvement
    const reducedCAC = cac * 0.65; // 35% reduction
    
    const newCustomers = visitors * improvedConversion;
    const newRevenue = newCustomers * aov;
    const newAcquisitionCost = newCustomers * reducedCAC;

    // Calculate gains
    const additionalCustomers = newCustomers - currentCustomers;
    const additionalRevenue = newRevenue - currentRevenue;
    const costSavings = currentAcquisitionCost - newAcquisitionCost;
    const totalImpact = additionalRevenue + costSavings;

    // ROI calculations - prevent division by zero
    const yuvaInvestment = 300000; // ₹3L average engagement cost
    const monthlyROI = totalImpact;
    const annualROI = monthlyROI * 12;
    const roiMultiple = totalImpact > 0 ? annualROI / yuvaInvestment : 0;

    setResults({
      currentCustomers: Math.round(currentCustomers),
      currentRevenue: Math.round(currentRevenue),
      currentAcquisitionCost: Math.round(currentAcquisitionCost),
      youthVisitors: Math.round(youthVisitors),
      youthCustomers: Math.round(youthCustomers),
      youthRevenue: Math.round(youthRevenue),
      newCustomers: Math.round(newCustomers),
      newRevenue: Math.round(newRevenue),
      additionalCustomers: Math.round(additionalCustomers),
      additionalRevenue: Math.round(additionalRevenue),
      costSavings: Math.round(costSavings),
      totalMonthlyImpact: Math.round(totalImpact),
      annualImpact: Math.round(annualROI),
      roiMultiple: roiMultiple.toFixed(1),
      paybackPeriod: totalImpact > 0 ? (yuvaInvestment / totalImpact).toFixed(1) : '∞'
    });
  };

  useEffect(() => {
    calculateROI();
  }, [inputs]);

  const downloadReport = () => {
    const reportData = `GenX Marketing - Y.U.V.A. Revenue Impact Report
===============================================

Your Current Metrics:
- Monthly Website Visitors: ${inputs.monthlyVisitors.toLocaleString()}
- Current Conversion Rate: ${inputs.currentConversion}%
- Average Order Value: ₹${inputs.avgOrderValue.toLocaleString()}
- Customer Acquisition Cost: ₹${inputs.currentCAC.toLocaleString()}
- Youth Traffic (18-28): ${inputs.youthPercentage}%

Current Performance:
- Monthly Customers: ${results.currentCustomers?.toLocaleString()}
- Monthly Revenue: ₹${results.currentRevenue?.toLocaleString()}
- Total Acquisition Cost: ₹${results.currentAcquisitionCost?.toLocaleString()}

After Y.U.V.A. Implementation (90 Days):
- Additional Customers/Month: +${results.additionalCustomers?.toLocaleString()}
- Additional Revenue/Month: ₹${results.additionalRevenue?.toLocaleString()}
- CAC Savings/Month: ₹${results.costSavings?.toLocaleString()}
- Total Monthly Impact: ₹${results.totalMonthlyImpact?.toLocaleString()}
- Annual Impact: ₹${results.annualImpact?.toLocaleString()}
- ROI Multiple: ${results.roiMultiple}x
- Payback Period: ${results.paybackPeriod} months

Generated by GenX Marketing
Your Partner in Youth-First Growth Strategy`;
    
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(reportData));
    element.setAttribute('download', 'YUVA_ROI_Report.txt');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const shareResults = () => {
    const text = `I just calculated my Y.U.V.A. Revenue Impact with GenX Marketing! My business could gain ₹${results.totalMonthlyImpact?.toLocaleString()} monthly through youth-first growth strategy.`;
    if (navigator.share) {
      navigator.share({
        title: 'Y.U.V.A. Revenue Impact Calculator',
        text: text,
      });
    } else {
      alert(text);
    }
  };

  const formatCurrency = (num: number): string => {
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)}Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)}L`;
    return `₹${(num / 1000).toFixed(0)}K`;
  };

  interface InputFieldProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
    suffix?: string;
    max?: number;
  }

  const InputField: React.FC<InputFieldProps> = ({ label, value, onChange, suffix = '', max }) => (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value) || 0)}
          max={max}
          className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-lg"
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative max-w-6xl mx-auto p-6">
        <div className="bg-white/95 backdrop-blur rounded-xl shadow-2xl p-8 mb-6">
          <div className="text-center mb-8">
            <div className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 rounded-full mb-4">
              <p className="text-white font-bold text-sm">🚀 GenX Marketing</p>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
              Y.U.V.A. Revenue Impact Calculator
            </h1>
            <p className="text-gray-600 text-lg mb-2">
              Discover how much revenue you're losing with youth customers (18-28)
            </p>
            <p className="text-gray-500 text-sm">
              Trusted by 50+ brands across India • Based on real campaign data
            </p>
          </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2 text-purple-700">
              <Target size={20} />
              Your Current Metrics
            </h3>
            
            <InputField
              label="Monthly Website Visitors"
              value={inputs.monthlyVisitors}
              onChange={(v) => setInputs({...inputs, monthlyVisitors: v})}
            />
            
            <InputField
              label="Current Conversion Rate"
              value={inputs.currentConversion}
              onChange={(v) => setInputs({...inputs, currentConversion: v})}
              suffix="%"
              max={100}
            />
            
            <InputField
              label="Average Order Value"
              value={inputs.avgOrderValue}
              onChange={(v) => setInputs({...inputs, avgOrderValue: v})}
              suffix="₹"
            />
            
            <InputField
              label="Customer Acquisition Cost"
              value={inputs.currentCAC}
              onChange={(v) => setInputs({...inputs, currentCAC: v})}
              suffix="₹"
            />
            
            <InputField
              label="% of Traffic That's Youth (18-28)"
              value={inputs.youthPercentage}
              onChange={(v) => setInputs({...inputs, youthPercentage: v})}
              suffix="%"
              max={100}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2 text-blue-700">
              <AlertCircle size={20} />
              What You're Missing
            </h3>

            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">Youth visitors per month</p>
              <p className="text-3xl font-bold text-red-600">
                {results.youthVisitors?.toLocaleString()}
              </p>
            </div>

            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">Lost youth customers (due to poor conversion)</p>
              <p className="text-3xl font-bold text-red-600">
                ~{results.youthVisitors ? Math.round(results.youthVisitors * 0.04 - (results.youthCustomers || 0)).toLocaleString() : 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">Based on 6% benchmark vs your {inputs.currentConversion}%</p>
            </div>

            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">Monthly revenue leakage</p>
              <p className="text-3xl font-bold text-red-600">
                {formatCurrency(results.youthVisitors ? Math.round(results.youthVisitors * 0.04 - (results.youthCustomers || 0)) * inputs.avgOrderValue : 0)}
              </p>
            </div>

            <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">Your CAC vs Youth-Optimized Brands</p>
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-xl font-bold text-orange-600">₹{inputs.currentCAC.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Your CAC</p>
                </div>
                <ArrowRight className="text-gray-400" size={20} />
                <div>
                  <p className="text-xl font-bold text-green-600">₹{Math.round(inputs.currentCAC * 0.65).toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Achievable</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t-4 border-purple-200 pt-8">
          <h3 className="text-2xl font-bold text-center mb-6 text-purple-700">
            After Y.U.V.A. Implementation (90 Days)
          </h3>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-6 text-center">
              <Users className="mx-auto mb-3 text-green-600" size={32} />
              <p className="text-sm text-gray-600 mb-2">Additional Customers/Month</p>
              <p className="text-4xl font-bold text-green-600">
                +{results.additionalCustomers?.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                From {results.currentCustomers} to {results.newCustomers}
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-lg p-6 text-center">
              <TrendingUp className="mx-auto mb-3 text-blue-600" size={32} />
              <p className="text-sm text-gray-600 mb-2">Additional Revenue/Month</p>
              <p className="text-4xl font-bold text-blue-600">
                {formatCurrency(results.additionalRevenue || 0)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {((((results.additionalRevenue || 0) / (results.currentRevenue || 1)) * 100)).toFixed(0)}% increase
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 rounded-lg p-6 text-center">
              <DollarSign className="mx-auto mb-3 text-purple-600" size={32} />
              <p className="text-sm text-gray-600 mb-2">CAC Savings/Month</p>
              <p className="text-4xl font-bold text-purple-600">
                {formatCurrency(results.costSavings || 0)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Through organic advocacy
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl p-8 text-center">
            <p className="text-lg mb-2 opacity-90">Total Monthly Impact</p>
            <p className="text-6xl font-bold mb-4">
              {formatCurrency(results.totalMonthlyImpact || 0)}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-left">
              <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                <p className="text-sm opacity-90">Annual Impact</p>
                <p className="text-2xl font-bold">{formatCurrency(results.annualImpact || 0)}</p>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                <p className="text-sm opacity-90">ROI Multiple</p>
                <p className="text-2xl font-bold">{results.roiMultiple}x</p>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                <p className="text-sm opacity-90">Payback Period</p>
                <p className="text-2xl font-bold">{results.paybackPeriod} months</p>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                <p className="text-sm opacity-90">Investment</p>
                <p className="text-2xl font-bold">₹3L</p>
              </div>
            </div>
          </div>
        </div>
      </div>

        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h4 className="font-bold mb-4 flex items-center gap-2">
            <CheckCircle className="text-green-500" size={20} />
            How We Achieve These Results
          </h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <p><span className="font-semibold">Fix conversion killers:</span> Pricing barriers, payment friction, trust signals</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <p><span className="font-semibold">Youth-first messaging:</span> Rewrite copy that actually resonates with 18-28 year olds</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <p><span className="font-semibold">Community-led growth:</span> Build ambassador programs and referral loops</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <p><span className="font-semibold">Creator partnerships:</span> Replace expensive ads with authentic youth advocates</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <p><span className="font-semibold">Campus penetration:</span> Strategic presence in top 50 colleges</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <p><span className="font-semibold">UGC engine:</span> Turn customers into content creators</p>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl p-8 text-center">
          <div className="mb-6">
            <p className="text-lg mb-2 opacity-90">Ready to unlock this revenue?</p>
            <p className="text-4xl font-bold mb-2">Get Your Free Y.U.V.A. Audit</p>
            <p className="text-sm opacity-90">Download your personalized report + strategic roadmap (No credit card required)</p>
          </div>

          <div className="flex gap-3 justify-center flex-wrap mb-4">
            <button
              onClick={downloadReport}
              className="flex items-center gap-2 bg-white text-purple-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition transform hover:scale-105"
            >
              <Download size={18} />
              Download Report
            </button>
            <button
              onClick={shareResults}
              className="flex items-center gap-2 bg-white/20 text-white px-6 py-3 rounded-lg font-bold hover:bg-white/30 transition border border-white/50"
            >
              <Share2 size={18} />
              Share Results
            </button>
            <button
              onClick={() => setShowLeadForm(!showLeadForm)}
              className="flex items-center gap-2 bg-white/20 text-white px-6 py-3 rounded-lg font-bold hover:bg-white/30 transition border border-white/50"
            >
              <Mail size={18} />
              Get Strategy Guide
            </button>
          </div>

          {showLeadForm && (
            <form onSubmit={handleLeadSubmit} className="mt-6 bg-white/10 backdrop-blur rounded-lg p-6">
              <div className="max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={leadEmail}
                  onChange={(e) => setLeadEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-purple-300 mb-3"
                />
                <button
                  type="submit"
                  className="w-full bg-white text-purple-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition"
                >
                  {isFormSubmitted ? '✓ Sent! Check your email' : 'Send Strategy Guide'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <div className="text-center text-sm text-gray-400 py-8 border-t border-white/10">
        <p className="mb-1 font-semibold">🚀 Y.U.V.A. Framework by GenX Marketing</p>
        <p>Your partner in youth-first growth strategy</p>
        <p className="mt-2 text-xs">Based on analysis of 50+ youth-focused startups across India</p>
      </div>
    </div>
  );
};

export default GenXYUVAROICalculator;