export interface DashboardData {
    total: number;
    pending: number;
    inProgress: number;
    done: number;
}
interface LambdaEvent {
    notes: Array<{
        status: string;
    }>;
}
export declare function handler(event: LambdaEvent): Promise<DashboardData>;
export {};
