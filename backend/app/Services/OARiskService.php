<?php

namespace App\Services;

class OARiskService
{
    private function categorizeKneeROM(float $rom): array
    {
        $category = match (true) {
            $rom >= 50 => ['level' => 'Low', 'indonesian' => 'NON-OA'],
            $rom >= 45 => ['level' => 'Low', 'indonesian' => 'Risiko Rendah'],
            $rom >= 35 => ['level' => 'Medium', 'indonesian' => 'Risiko Sedang'],
            default => ['level' => 'High', 'indonesian' => 'Risiko Tinggi']
        };
        return ['value' => $rom, 'category' => $category['level'], 'indonesian' => $category['indonesian']];
    }

    private function categorizeAsymmetry(float $asymmetry): array
    {
        $category = match (true) {
            $asymmetry < 10 => ['level' => 'Low', 'indonesian' => 'NON-OA'],
            $asymmetry <= 15 => ['level' => 'Low', 'indonesian' => 'Risiko Rendah'],
            $asymmetry <= 30 => ['level' => 'Medium', 'indonesian' => 'Risiko Sedang'],
            default => ['level' => 'High', 'indonesian' => 'Risiko Tinggi']
        };
        return ['value' => $asymmetry, 'category' => $category['level'], 'indonesian' => $category['indonesian']];
    }

    private function categorizeGaitSpeed(float $speed): array
    {
        $category = match (true) {
            $speed > 1.2 => ['level' => 'Low', 'indonesian' => 'NON-OA'],
            $speed >= 1.0 => ['level' => 'Low', 'indonesian' => 'Risiko Rendah'],
            $speed >= 0.8 => ['level' => 'Medium', 'indonesian' => 'Risiko Sedang'],
            default => ['level' => 'High', 'indonesian' => 'Risiko Tinggi']
        };
        return ['value' => $speed, 'category' => $category['level'], 'indonesian' => $category['indonesian']];
    }

    private function categorizeStanceTime(float $time): array
    {
        $category = match (true) {
            $time < 0.70 => ['level' => 'Low', 'indonesian' => 'NON-OA'],
            $time <= 0.80 => ['level' => 'Low', 'indonesian' => 'Risiko Rendah'],
            $time <= 0.90 => ['level' => 'Medium', 'indonesian' => 'Risiko Sedang'],
            default => ['level' => 'High', 'indonesian' => 'Risiko Tinggi']
        };
        return ['value' => $time, 'category' => $category['level'], 'indonesian' => $category['indonesian']];
    }

    private function categorizePressureDist(float $dist): array
    {
        $category = match (true) {
            $dist < 5 => ['level' => 'Low', 'indonesian' => 'NON-OA'],
            $dist <= 10 => ['level' => 'Low', 'indonesian' => 'Risiko Rendah'],
            $dist <= 20 => ['level' => 'Medium', 'indonesian' => 'Risiko Sedang'],
            default => ['level' => 'High', 'indonesian' => 'Risiko Tinggi']
        };
        return ['value' => $dist, 'category' => $category['level'], 'indonesian' => $category['indonesian']];
    }

    public function calculate(array $data): array
    {
        $romLeft = $data['rom_knee_left'] ?? 0;
        $romRight = $data['rom_knee_right'] ?? 0;
        $romAvg = ($romLeft + $romRight) / 2;  

        $asymmetry = abs($romLeft - $romRight) / (($romLeft + $romRight) / 2) * 100;  

        $gaitSpeed = 4 / ($data['gait_duration'] ?? 1);  

        $stanceTimeAvg = ($data['stance_time_left'] ?? 0 + $data['stance_time_right'] ?? 0) / 2;  

        $pressureDist = abs(($data['weight_left'] ?? 0) - ($data['weight_right'] ?? 0)) / ((($data['weight_left'] ?? 0) + ($data['weight_right'] ?? 0)) / 2) * 100;  

        $kneeROM = $this->categorizeKneeROM($romAvg);
        $asymmetryResult = $this->categorizeAsymmetry($asymmetry);
        $gaitSpeedResult = $this->categorizeGaitSpeed($gaitSpeed);
        $stanceTimeResult = $this->categorizeStanceTime($stanceTimeAvg);
        $pressureDistResult = $this->categorizePressureDist($pressureDist);

        $numericScores = [
            $this->levelToNumeric($kneeROM['category']),
            $this->levelToNumeric($asymmetryResult['category']),
            $this->levelToNumeric($gaitSpeedResult['category']),
            $this->levelToNumeric($stanceTimeResult['category']),
            $this->levelToNumeric($pressureDistResult['category'])
        ];
        $avgNumeric = array_sum($numericScores) / count($numericScores);
        $overallScore = round($avgNumeric * 33.33);  
        $overallLevel = $this->numericToLevel($avgNumeric);

        $individual = [
            'knee_flexion' => $kneeROM,
            'asymmetry' => $asymmetryResult,
            'gait_speed' => $gaitSpeedResult,
            'stance_time' => $stanceTimeResult,
            'pressure_distribution' => $pressureDistResult
        ];

        $explanation = $this->getExplanation($overallLevel, $individual);
        $recommendations = $this->getRecommendations($overallLevel);

        return [
            'overall' => [
                'score' => $overallScore,
                'riskLevel' => $overallLevel,
                'indonesian' => $this->getIndonesianLevel($overallLevel)
            ],
            'individual' => $individual,
            'computed_values' => [  
                'rom_avg' => $romAvg,
                'asymmetry_pct' => $asymmetry,
                'gait_speed_ms' => $gaitSpeed,
                'stance_time_avg_s' => $stanceTimeAvg,
                'pressure_dist_pct' => $pressureDist
            ],
            'explanation' => $explanation,
            'recommendations' => $recommendations
        ];
    }

    private function levelToNumeric(string $level): int
    {
        return match ($level) {
            'Low' => 1,
            'Medium' => 2,
            'High' => 3,
            default => 1
        };
    }

    private function numericToLevel(float $numeric): string
    {
        if ($numeric <= 1.66) return 'Low';
        if ($numeric <= 2.33) return 'Medium';
        return 'High';
    }

    private function getIndonesianLevel(string $level): string
    {
        return match ($level) {
            'Low' => 'Risiko Rendah / NON-OA',
            'Medium' => 'Risiko Sedang',
            'High' => 'Risiko Tinggi',
            default => 'Tidak Diketahui'
        };
    }

    private function getExplanation(string $level, array $individual): string
    {
        $metricSummary = implode(', ', array_map(fn($m) => "{$m['indonesian']} ({$m['value']})", $individual));
        return match ($level) {
            'Low' => "Semua metrik menunjukkan kondisi baik. Bandingkan dengan standar: {$metricSummary}. Resiko OA rendah; lanjutkan monitoring.",
            'Medium' => "Beberapa metrik menunjukkan ketidakseimbangan. Bandingkan dengan standar: {$metricSummary}. Resiko OA sedang; perhatikan pencegahan.",
            'High' => "Metrik menunjukkan gangguan signifikan. Bandingkan dengan standar: {$metricSummary}. Resiko OA tinggi; konsultasi segera.",
            default => 'Tidak dapat ditentukan dari data sensor.'
        };
    }

    private function getRecommendations(string $level): array
    {
        return match ($level) {
            'Low' => [
                'Lanjutkan kegiatan duduk-berdiri dan berjalan normal.',
                'Pantau ROM lutut ≥50° dan asimetri <10% secara berkala.',
                'Gunakan ArthroTrack untuk data IMU/Loadcell harian.'
            ],
            'Medium' => [
                'Latih fleksi lutut untuk ROM >45° (hindari beban berat).',
                'Perbaiki asimetri dengan fisioterapi; target <15%.',
                'Pantau kecepatan langkah >1.0 m/s dan distribusi tekanan <10%.'
            ],
            'High' => [
                'Segera konsultasi dokter untuk ROM <35° atau asimetri >30%.',
                'Hindari aktivitas yang membebani lutut; gunakan penyangga.',
                'Evaluasi stance time >0.90s dan tekanan >20% dengan spesialis OA.'
            ],
            default => ['Kumpulkan data sensor lengkap untuk penilaian akurat.']
        };
    }
}