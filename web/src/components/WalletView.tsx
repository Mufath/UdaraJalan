import React, { useState } from 'react';
import { 
  CreditCard, 
  ArrowDownToLine, 
  Zap, 
  Clock, 
  CheckCircle, 
  Check, 
  X, 
  TrendingUp, 
  Coins, 
  Leaf, 
  ShieldCheck, 
  Gift, 
  ArrowUpRight,
  Filter,
  BarChart3,
  Compass,
  MapPin
} from 'lucide-react';
import { TransactionRecord } from '../types';
import { StackedBars } from './StackedBars';

interface WalletViewProps {
  transactions: TransactionRecord[];
}

export const WalletView: React.FC<WalletViewProps> = ({ transactions: initialTransactions }) => {
  const [balanceRupiah, setBalanceRupiah] = useState(1782000);
  const [totalPoints, setTotalPoints] = useState(14850);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawMethod, setWithdrawMethod] = useState<'gopay' | 'ovo' | 'dana' | 'qris'>('gopay');
  const [withdrawAmount, setWithdrawAmount] = useState(100000);
  const [isSuccessAlert, setIsSuccessAlert] = useState(false);
  const [selectedDayIdx, setSelectedDayIdx] = useState(6);
  const [filterType, setFilterType] = useState<'all' | 'multiplier' | 'regular'>('all');
  const [transactions, setTransactions] = useState(initialTransactions);
  const [walletChartMode, setWalletChartMode] = useState<'histogram' | 'stacked'>('histogram');

  // Weekly income distribution for Activity/Bar widget (Inspired by reference)
  const weeklyEarnings = [
    { day: 'Sen', amount: 'Rp240.000', raw: 240000, points: 2000, km: 28.5, height: 60 },
    { day: 'Sel', amount: 'Rp280.000', raw: 280000, points: 2333, km: 34.2, height: 75 },
    { day: 'Rab', amount: 'Rp210.000', raw: 210000, points: 1750, km: 31.0, height: 55 },
    { day: 'Kam', amount: 'Rp340.000', raw: 340000, points: 2833, km: 42.8, height: 90 },
    { day: 'Jum', amount: 'Rp380.000', raw: 380000, points: 3166, km: 45.1, height: 100 },
    { day: 'Sab', amount: 'Rp310.000', raw: 310000, points: 2583, km: 39.0, height: 82 },
    { day: 'Min', amount: 'Rp178.000', raw: 178000, points: 1485, km: 38.4, height: 50, isToday: true }
  ];

  const currentSelectedDay = weeklyEarnings[selectedDayIdx];

  const handleWithdraw = () => {
    if (balanceRupiah < withdrawAmount) {
      alert('Saldo tidak mencukupi');
      return;
    }
    const pointsToDeduct = Math.round(withdrawAmount / 120);
    setBalanceRupiah(prev => prev - withdrawAmount);
    setTotalPoints(prev => Math.max(0, prev - pointsToDeduct));
    
    // Add new withdrawal record to transaction list
    const newTx: TransactionRecord = {
      id: `TX-WD-${Date.now()}`,
      title: `Pencairan Saldo ke ${withdrawMethod.toUpperCase()}`,
      timeString: 'Baru saja',
      validatedKm: 0,
      rupiahAmount: -withdrawAmount,
      isMultiplierZone: false
    };
    setTransactions(prev => [newTx, ...prev]);

    setShowWithdrawModal(false);
    setIsSuccessAlert(true);
    setTimeout(() => {
      setIsSuccessAlert(false);
    }, 4000);
  };

  const filteredTransactions = transactions.filter(tx => {
    if (filterType === 'multiplier') return tx.isMultiplierZone;
    if (filterType === 'regular') return !tx.isMultiplierZone && tx.rupiahAmount > 0;
    return true;
  });

  return (
    <div className="space-y-6 pb-24">
      {/* 1. Header Overview Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-1">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider font-mono">
              Finansial & Reward EV
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight mt-0.5">
            Dompet & Penghasilan
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 font-normal">
            Insentif kilometer tervalidasi armada motor listrik pemantau udara
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setShowWithdrawModal(true)}
            className="flex items-center space-x-1.5 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-full text-xs font-semibold shadow-sm transition-transform active:scale-95"
          >
            <ArrowDownToLine className="w-3.5 h-3.5" />
            <span>Tarik Saldo</span>
          </button>
          <button
            onClick={() => alert('Voucher diskon ganti baterai Rp15.000 siap ditukarkan di swap station terdekat.')}
            className="flex items-center space-x-1.5 px-4 py-2 bg-white hover:bg-neutral-50 text-neutral-800 rounded-full text-xs font-semibold border border-neutral-200/90 shadow-xs transition-colors"
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Voucher Swap</span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {isSuccessAlert && (
        <div className="p-4 bg-neutral-900 text-white rounded-2xl text-xs font-medium flex items-center justify-between shadow-md animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center space-x-2.5">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Pencairan saldo <strong>Rp{withdrawAmount.toLocaleString('id-ID')}</strong> ke <strong>{withdrawMethod.toUpperCase()}</strong> berhasil diproses!</span>
          </div>
          <button onClick={() => setIsSuccessAlert(false)} className="text-emerald-200 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ========================================================
          GRID ROW 1: Smart Card + Weekly Earnings Activity Chart
         ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* CARD 1: Clean Harmonious Balance Card (Matching Design System) */}
        <div className="md:col-span-6 flex flex-col">
          <span className="widget-overline mb-1.5">
            <CreditCard className="w-3 h-3 text-neutral-400" />
            Dompet & Saldo Mitra
          </span>
          <div className="ref-card p-6 flex flex-col justify-between flex-1">
            <div>
              {/* Card Header with Fleet Pill & Card ID */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-bold font-mono text-xs shadow-xs">
                    EV
                  </div>
                  <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-neutral-100 rounded-full border border-neutral-200/70 text-xs font-semibold text-neutral-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Armada Listrik DKI</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-medium text-neutral-400">•••• 8491</span>
              </div>

              {/* Large Metric Figures */}
              <div className="space-y-1 mb-5">
                <span className="text-xs font-mono text-neutral-500 uppercase tracking-wider block font-semibold">
                  Saldo Siap Tarik
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold tracking-tight font-mono tabular-nums text-neutral-900">
                  Rp{balanceRupiah.toLocaleString('id-ID')}
                </div>
                <div className="pt-1.5">
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold font-mono">
                    <Coins className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{totalPoints.toLocaleString('id-ID')} Poin Terverifikasi</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle: Dual Standard vs H3 Rate Breakdown */}
            <div className="grid grid-cols-2 gap-3 text-xs mb-5">
              <div className="bg-neutral-50 p-3.5 rounded-2xl border border-neutral-100">
                <div className="text-neutral-400 text-[10px] font-semibold">Tarif Dasar Standar</div>
                <div className="font-extrabold text-neutral-900 text-sm mt-0.5 font-mono">Rp120 / km</div>
                <div className="text-[10px] text-neutral-400 mt-1 font-mono">Perjalanan tervalidasi</div>
              </div>
              <div className="bg-neutral-50 p-3.5 rounded-2xl border border-neutral-100">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500 text-[10px] font-semibold">Prioritas Spasial</span>
                  <span className="px-1.5 py-0.5 bg-neutral-900 text-white rounded font-mono text-[9px] font-bold">2.0x</span>
                </div>
                <div className="font-extrabold text-emerald-600 text-sm mt-0.5 font-mono">Rp240 / km</div>
                <div className="text-[10px] text-neutral-500 mt-1 font-mono truncate">Koridor Sudirman - Dukuh Atas</div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-neutral-100 flex items-center gap-2.5">
              <button
                onClick={() => setShowWithdrawModal(true)}
                className="flex-1 flex items-center justify-center space-x-1.5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-full text-xs font-semibold shadow-xs transition-transform active:scale-95"
              >
                <ArrowDownToLine className="w-3.5 h-3.5" />
                <span>Tarik Saldo</span>
              </button>
              <button
                onClick={() => alert('Voucher diskon ganti baterai Rp15.000 siap ditukarkan di swap station terdekat.')}
                className="px-4 py-2.5 bg-white hover:bg-neutral-50 text-neutral-700 rounded-full text-xs font-semibold border border-neutral-200/80 shadow-xs transition-colors flex items-center space-x-1"
              >
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Voucher Swap</span>
              </button>
            </div>
          </div>
        </div>

        {/* CARD 2: Weekly Earnings Histogram / Stacked Bars (6 Cols) */}
        <div className="md:col-span-6 flex flex-col">
          <div className="flex items-center justify-between mb-1.5">
            <span className="widget-overline">
              <TrendingUp className="w-3 h-3 text-neutral-400" />
              Tren Insentif & Komposisi
            </span>
            <div className="flex items-center p-0.5 bg-neutral-100 rounded-lg border border-neutral-200/60 text-[10px] font-semibold">
              <button
                onClick={() => setWalletChartMode('stacked')}
                className={`px-2.5 py-0.5 rounded-md transition-all ${
                  walletChartMode === 'stacked'
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                Stacked Bars
              </button>
              <button
                onClick={() => setWalletChartMode('histogram')}
                className={`px-2.5 py-0.5 rounded-md transition-all ${
                  walletChartMode === 'histogram'
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                7 Hari
              </button>
            </div>
          </div>
          <div className="ref-card p-5 flex flex-col justify-between flex-1">
            {walletChartMode === 'stacked' ? (
              <div className="flex flex-col w-full">
                <StackedBars 
                  embedded={true}
                  variant="financial"
                  colour="Colour" 
                  bars={16} 
                  width="100%"
                  title="Komposisi Insentif Armada"
                  subtitle="4 Komponen Pendapatan • Pencairan"
                  unit="total saldo"
                  totalOverride={balanceRupiah}
                  categories={["Bonus Zona H3 (2.0x)", "Tarif Dasar KM", "Subsidi Rute Bersih", "Akurasi Sensor"]}
                  escalatedLabel="Pencairan Tunai"
                />

                {/* Financial Component Legend */}
                <div className="w-full mt-3 pt-3 border-t border-neutral-100 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono text-neutral-500">
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-xs bg-[#8b5cf6] shrink-0" />
                    <span className="truncate">Bonus H3 (2x)</span>
                  </span>
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-xs bg-[#0ea5e9] shrink-0" />
                    <span className="truncate">Tarif KM (Rp120)</span>
                  </span>
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-xs bg-[#f59e0b] shrink-0" />
                    <span className="truncate">Subsidi Bersih</span>
                  </span>
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-xs bg-[#10b981] shrink-0" />
                    <span className="truncate">Akurasi Sensor</span>
                  </span>
                  <span className="flex items-center space-x-1.5 col-span-2 sm:col-span-4 text-rose-600 font-semibold pt-1">
                    <span className="w-2 h-2 rounded-xs bg-[#ef4444] shrink-0" />
                    <span>Pencairan Tunai (Di Bawah Baseline)</span>
                  </span>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-neutral-800">Distribusi 7 Hari</span>
                  <span className="text-[11px] font-mono text-neutral-400">
                    Total: Rp2.138.000
                  </span>
                </div>

                {/* Dynamic Day Detail Box */}
                <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-100 flex items-center justify-between mb-3">
                  <div>
                    <div className="text-[10px] text-neutral-400 font-mono">Hari {currentSelectedDay.day}</div>
                    <div className="text-lg font-bold font-mono text-neutral-900 mt-0.5">
                      {currentSelectedDay.amount}
                    </div>
                  </div>
                  <div className="text-right text-xs font-mono">
                    <div className="font-semibold text-blue-600">+{currentSelectedDay.points} pts</div>
                    <div className="text-[10px] text-neutral-400">{currentSelectedDay.km} km tervalidasi</div>
                  </div>
                </div>

                {/* 7-Day Bar Histogram with Pill Shapes (Reference Style: Pastel blue + Electric active) */}
                <div className="h-28 pt-2 flex items-end justify-between gap-1.5 px-1">
                  {weeklyEarnings.map((item, idx) => {
                    const isSelected = selectedDayIdx === idx;
                    return (
                      <button
                        key={item.day}
                        onClick={() => setSelectedDayIdx(idx)}
                        className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group focus:outline-none"
                      >
                        <div className="w-full bg-neutral-100 rounded-full h-full flex items-end overflow-hidden p-0.5">
                          <div 
                            className={`w-full rounded-full transition-all duration-300 ${
                              isSelected
                                ? 'bg-blue-600 shadow-md shadow-blue-500/30'
                                : 'bg-sky-200 hover:bg-sky-300'
                            }`}
                            style={{ height: `${item.height}%` }}
                            title={`${item.day}: ${item.amount}`}
                          />
                        </div>
                        <span className={`text-[10px] font-mono transition-colors ${
                          isSelected ? 'font-bold text-blue-600' : 'text-neutral-400'
                        }`}>
                          {item.day}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Card Footer Status */}
            <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] font-mono text-neutral-400">
              <span className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Sinkron Otomatis E-Wallet</span>
              </span>
              <span>Diperbarui 1m lalu</span>
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================
          GRID ROW 2: 3 Environmental & Rewards Metric Squircles
         ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Metric 1: Cakupan Pemetaan Jalan */}
        <div className="ref-card p-4 flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-sky-500 flex items-center justify-center text-white shadow-xs shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-bold font-mono text-neutral-900">38.4 km Terpetakan</div>
            <div className="text-xs text-neutral-500">Cakupan Deteksi Ruas Jalan Hari Ini</div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="ref-card p-4 flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-xs shrink-0">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-bold font-mono text-neutral-900">14.850 Poin</div>
            <div className="text-xs text-neutral-500">Nilai Konversi Rp120/poin</div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="ref-card p-4 flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xs shrink-0">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-bold font-mono text-neutral-900">12 Mitra Swap</div>
            <div className="text-xs text-neutral-500">Stasiun Penukaran Baterai DKI</div>
          </div>
        </div>

      </div>

      {/* ========================================================
          GRID ROW 3: Riwayat Perjalanan Tervalidasi
         ======================================================== */}
      <div className="flex flex-col">
        <span className="widget-overline mb-1.5">
          <Clock className="w-3 h-3 text-neutral-400" />
          Catatan Validasi Lapangan
        </span>
        <div className="ref-card p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <h2 className="text-sm font-bold text-neutral-900">
                Riwayat Perjalanan & Insentif Tervalidasi
              </h2>
              <p className="text-xs text-neutral-400 font-mono mt-0.5">
                Sinkronisasi otomatis dengan sensor optik SPS30 & log anti-cheat
              </p>
            </div>

            {/* Filter Segmented Controls */}
            <div className="flex items-center p-1 bg-neutral-100 rounded-full border border-neutral-200/60 self-start sm:self-auto">
              {[
                { id: 'all', label: 'Semua' },
                { id: 'multiplier', label: 'Misi 2.0x' },
                { id: 'regular', label: 'Reguler' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilterType(f.id as any)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    filterType === f.id
                      ? 'bg-white text-neutral-900 shadow-xs'
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-neutral-100">
            {filteredTransactions.map((tx) => {
              const isNegative = tx.rupiahAmount < 0;
              return (
                <div key={tx.id} className="py-3.5 flex items-center justify-between group hover:bg-neutral-50/50 -mx-3 px-3 rounded-2xl transition-colors">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-neutral-900 flex items-center space-x-2">
                      <span>{tx.title}</span>
                      {tx.isMultiplierZone && (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-mono text-[10px] font-bold">
                          Bonus 2.0x
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-neutral-400 font-mono flex items-center space-x-1.5">
                      <Clock className="w-3 h-3 text-neutral-400" />
                      <span>{tx.timeString}</span>
                      {tx.validatedKm > 0 && (
                        <>
                          <span>•</span>
                          <span>{tx.validatedKm} km</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <div className={`text-sm font-bold tabular-nums ${isNegative ? 'text-rose-600' : 'text-neutral-900'}`}>
                      {isNegative ? `-Rp${Math.abs(tx.rupiahAmount).toLocaleString('id-ID')}` : `+Rp${tx.rupiahAmount.toLocaleString('id-ID')}`}
                    </div>
                    <div className="text-[10px] text-neutral-400 flex items-center justify-end space-x-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-500" />
                      <span>Lolos fusi sensor</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Interactive Modal Tarik Saldo */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm z-50 flex items-end justify-center p-4 sm:items-center animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-[28px] p-6 shadow-2xl border border-neutral-200/90 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <div>
                <h3 className="text-base font-bold text-neutral-900">Pencairan Saldo Insentif</h3>
                <p className="text-xs text-neutral-500">Konversi saldo km tervalidasi ke dompet digital</p>
              </div>
              <button 
                onClick={() => setShowWithdrawModal(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-full hover:bg-neutral-100 transition-colors"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Nominal Chips */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-700">Pilih Nominal Pencairan</label>
              <div className="grid grid-cols-4 gap-2">
                {[50000, 100000, 250000, 500000].map(amount => (
                  <button
                    key={amount}
                    onClick={() => setWithdrawAmount(amount)}
                    className={`py-2 px-1 rounded-xl text-xs font-bold font-mono transition-all ${
                      withdrawAmount === amount
                        ? 'bg-neutral-900 text-white shadow-xs'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    Rp{(amount / 1000)}rb
                  </button>
                ))}
              </div>
            </div>

            {/* Calculation Preview */}
            <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200/80 text-xs font-mono space-y-1">
              <div className="flex justify-between text-neutral-500">
                <span>Nominal Ditarik:</span>
                <span className="font-bold text-neutral-900">Rp{withdrawAmount.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Poin Ditukarkan:</span>
                <span className="font-bold text-blue-600">~{Math.round(withdrawAmount / 120)} pts</span>
              </div>
              <div className="flex justify-between text-neutral-500 pt-1 border-t border-neutral-200">
                <span>Sisa Saldo:</span>
                <span className="font-bold text-neutral-900">Rp{Math.max(0, balanceRupiah - withdrawAmount).toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* Dompet Digital Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-700">Tujuan Pencairan</label>
              <div className="grid grid-cols-2 gap-2">
                {(['gopay', 'ovo', 'dana', 'qris'] as const).map((method) => (
                  <div
                    key={method}
                    onClick={() => setWithdrawMethod(method)}
                    className={`p-3 rounded-2xl flex items-center justify-between cursor-pointer border text-xs transition-all ${
                      withdrawMethod === method
                        ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-bold ring-1 ring-blue-600'
                        : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    <span className="uppercase font-mono">{method}</span>
                    {withdrawMethod === method && <Check className="w-4 h-4 text-blue-600" />}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleWithdraw}
              className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-2xl transition-all shadow-md active:scale-[0.99]"
            >
              Konfirmasi & Cairkan Sekarang
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
