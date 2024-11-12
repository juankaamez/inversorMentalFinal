import React, { useState } from 'react';
import { ClipboardCheck, TrendingUp, Clock } from 'lucide-react';
import type { InvestorProfile } from '../types';

export default function RiskProfiler({ onProfileComplete }: { onProfileComplete: (profile: InvestorProfile) => void }) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<InvestorProfile>({
    riskTolerance: 'moderado',
    investmentGoals: [],
    timeHorizon: 5,
    initialInvestment: 10000
  });

  const handleSubmit = () => {
    onProfileComplete(profile);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Evaluación de Perfil de Inversión</h2>
      
      {step === 1 && (
        <div className="space-y-4">
          <h3 className="flex items-center text-xl text-gray-700">
            <TrendingUp className="mr-2" /> Tolerancia al Riesgo
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { id: 'conservador', label: 'Conservador' },
              { id: 'moderado', label: 'Moderado' },
              { id: 'agresivo', label: 'Agresivo' }
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setProfile({ ...profile, riskTolerance: id as any })}
                className={`p-4 rounded-lg border-2 transition-all ${
                  profile.riskTolerance === id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-200'
                }`}
              >
                <span>{label}</span>
              </button>
            ))}
          </div>
          <button
            onClick={() => setStep(2)}
            className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Siguiente Paso
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h3 className="flex items-center text-xl text-gray-700">
            <Clock className="mr-2" /> Horizonte de Inversión
          </h3>
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Plazo de Inversión (años)
              <input
                type="range"
                min="1"
                max="20"
                value={profile.timeHorizon}
                onChange={(e) => setProfile({ ...profile, timeHorizon: parseInt(e.target.value) })}
                className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
              />
              <span className="block text-center text-lg font-semibold text-blue-600">
                {profile.timeHorizon} años
              </span>
            </label>
          </div>
          <button
            onClick={() => setStep(3)}
            className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Siguiente Paso
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h3 className="flex items-center text-xl text-gray-700">
            <ClipboardCheck className="mr-2" /> Inversión Inicial
          </h3>
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Monto de Inversión Inicial ($)
              <input
                type="number"
                value={profile.initialInvestment}
                onChange={(e) => setProfile({ ...profile, initialInvestment: parseInt(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                min="1000"
                step="1000"
              />
            </label>
          </div>
          <button
            onClick={handleSubmit}
            className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Completar Perfil
          </button>
        </div>
      )}
    </div>
  );
}