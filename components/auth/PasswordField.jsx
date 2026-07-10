import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
export function PasswordField({ id, autoComplete, placeholder, registration, disabled = false, invalid = false }) {
    const [visible, setVisible] = useState(false);
    return (<div className="relative">
      <Input id={id} type={visible ? 'text' : 'password'} autoComplete={autoComplete} placeholder={placeholder} className="pr-11" disabled={disabled} aria-invalid={invalid} {...registration}/>
      <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-10 w-10 text-muted-foreground hover:text-foreground" aria-label={visible ? 'Hide password' : 'Show password'} title={visible ? 'Hide password' : 'Show password'} disabled={disabled} onClick={() => setVisible((value) => !value)}>
        {visible ? <EyeOff /> : <Eye />}
      </Button>
    </div>);
}
