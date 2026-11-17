// backend/services/dispatch-engine.service.ts
// Algorithmic candidate worker scoring & dispatch engine

export interface EngineWeights {
  tradeCompatibilityWeight: number; // 0.35
  skillCertificationWeight: number; // 0.25
  proximityWeight: number;          // 0.20
  workloadFairnessWeight: number;   // 0.20
  timeoutMinutes: number;           // 30
}

export interface WorkerCandidate {
  id: string;
  name: string;
  departmentCode: string;
  skills: string[];
  jurisdiction: string;
  activeTicketsCount: number;
  isOnline: boolean;
}

export class DispatchEngineService {
  private weights: EngineWeights = {
    tradeCompatibilityWeight: 0.35,
    skillCertificationWeight: 0.25,
    proximityWeight: 0.20,
    workloadFairnessWeight: 0.20,
    timeoutMinutes: 30
  };

  public getWeights(): EngineWeights {
    return { ...this.weights };
  }

  public updateWeights(newWeights: Partial<EngineWeights>): EngineWeights {
    this.weights = { ...this.weights, ...newWeights };
    return this.getWeights();
  }

  public scoreWorker(
    worker: WorkerCandidate,
    requiredDeptCode: string,
    requiredSkills: string[],
    targetLocation: string
  ): number {
    // 1. Trade Compatibility (0 or 1)
    const tradeScore = worker.departmentCode === requiredDeptCode ? 1.0 : 0.0;
    if (tradeScore === 0) return 0; // Incompatible trade cannot be dispatched

    // 2. Skill Certification Overlap (0.0 to 1.0)
    const matchingSkills = requiredSkills.filter(s => worker.skills.includes(s));
    const skillScore = requiredSkills.length > 0 ? matchingSkills.length / requiredSkills.length : 1.0;

    // 3. Proximity Geofence Match (0.0 to 1.0)
    const proximityScore = targetLocation.includes(worker.jurisdiction.split(' ')[0]) ? 1.0 : 0.6;

    // 4. Workload Balance / Anti-Fatigue (0.0 to 1.0)
    const workloadScore = 1.0 / (worker.activeTicketsCount + 1);

    // Composite Weighted Fitness Score
    const totalScore = (
      tradeScore * this.weights.tradeCompatibilityWeight +
      skillScore * this.weights.skillCertificationWeight +
      proximityScore * this.weights.proximityWeight +
      workloadScore * this.weights.workloadFairnessWeight
    );

    return Math.round(totalScore * 100) / 100;
  }

  public selectBestCandidate(
    candidates: WorkerCandidate[],
    requiredDeptCode: string,
    requiredSkills: string[],
    targetLocation: string
  ): { worker: WorkerCandidate; score: number } | null {
    const available = candidates.filter(c => c.isOnline);
    if (available.length === 0) return null;

    const scored = available
      .map(worker => ({
        worker,
        score: this.scoreWorker(worker, requiredDeptCode, requiredSkills, targetLocation)
      }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score);

    return scored[0] || null;
  }
}

