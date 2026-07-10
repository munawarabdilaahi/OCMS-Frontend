import { GraduationCap } from 'lucide-react';
export function AuthLayout({ children }) {
    return (<main className="min-h-screen bg-background">
      <div className="grid min-h-screen lg:grid-cols-[1fr_520px]">
        <section className="relative hidden overflow-hidden bg-slate-950 text-white lg:block">
          <img src="/campus-management.svg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-30"/>
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(8,47,73,0.78),rgba(5,150,105,0.55))]"/>
          <div className="relative flex h-full flex-col justify-between p-10">
            <div className="inline-flex items-center gap-3 text-sm font-medium">
              <span className="flex size-10 items-center justify-center rounded-md bg-white/10 ring-1 ring-white/20">
                <GraduationCap className="size-5"/>
              </span>
              Online Campus Management System
            </div>
            <div className="max-w-xl">
              <p className="mb-4 text-sm uppercase tracking-[0.24em] text-teal-100">OCMS Workspace</p>
              <h1 className="text-4xl font-semibold tracking-normal">
                Manage academics, finance, and campus operations from one secure console.
              </h1>
              <p className="mt-5 max-w-lg text-base leading-7 text-slate-200">
                Built for administrators, registrars, teachers, accountants, and students with a clean role-aware experience.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-sm text-slate-200">
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <p className="text-2xl font-semibold text-white">5</p>
                <p>Portal roles</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <p className="text-2xl font-semibold text-white">12</p>
                <p>Core modules</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <p className="text-2xl font-semibold text-white">RBAC</p>
                <p>Ready shell</p>
              </div>
            </div>
          </div>
        </section>
        <section className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
          <div className="w-full max-w-md">
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <span className="flex size-10 items-center justify-center rounded-md bg-primary/15 text-emerald-700 dark:text-teal-200">
                <GraduationCap className="size-5"/>
              </span>
              <div>
                <p className="font-semibold">OCMS</p>
                <p className="text-sm text-muted-foreground">Campus operations portal</p>
              </div>
            </div>
            {children}
          </div>
        </section>
      </div>
    </main>);
}
