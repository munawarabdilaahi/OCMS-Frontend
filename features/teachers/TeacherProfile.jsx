import { useNavigate, useParams } from '@/lib/router';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
export default function TeacherProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    return (<div className="p-6 space-y-4">
      <Button variant="outline" onClick={() => navigate('/teachers')}>
        <ArrowLeft className="mr-2 h-4 w-4"/> Back to teachers
      </Button>
      <div className="flex items-center justify-center p-12">
        <p className="text-muted-foreground">Teacher profile will be available once the backend teacher endpoints are connected.</p>
      </div>
    </div>);
}
