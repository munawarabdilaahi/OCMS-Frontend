import { useEffect, useState } from 'react';
import { BookOpen, GraduationCap, Users, Building2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { getStudentStats } from '@/services/students.service';
const statCards = [
    { key: 'totalStudents', label: 'Total Students', icon: GraduationCap, color: 'text-emerald-600 dark:text-emerald-400' },
    { key: 'activeStudents', label: 'Active Students', icon: Users, color: 'text-sky-600 dark:text-sky-400' },
    { key: 'totalUsers', label: 'Total Users', icon: BookOpen, color: 'text-amber-600 dark:text-amber-400' },
    { key: 'totalDepartments', label: 'Departments', icon: Building2, color: 'text-violet-600 dark:text-violet-400' },
];
export function Dashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        getStudentStats()
            .then((data) => setStats(data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);
    const firstName = user?.name?.split(' ')[0] || 'User';
    return (<div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">Welcome back, {firstName}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Here is what is happening across campus today.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map(({ key, label, icon: Icon, color }) => (<Card key={key}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
            <Icon className={`size-5 ${color}`}/>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{loading ? '—' : (stats?.[key] ?? 0).toLocaleString()}</p>
          </CardContent>
        </Card>))}
      </div>
    </div>);
}
