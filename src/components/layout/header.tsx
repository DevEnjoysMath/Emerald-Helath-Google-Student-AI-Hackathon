
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Menu, Stethoscope, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ProfileForm } from '@/components/profile-form';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';


const Header = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const isLoggedIn = !!user;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navLinks = [
    { href: "/symptom-checker", label: "Symptom Checker" },
    { href: "/find-practitioner", label: "Find a Practitioner" },
  ];

  const profileDialog = (
    <DialogContent className="sm:max-w-[725px]">
      <DialogHeader className="text-center">
        <Avatar className="h-24 w-24 mx-auto mb-4 border-4 border-primary/20">
            <AvatarImage src={user?.photoURL || "https://placehold.co/100x100.png"} alt="User avatar" data-ai-hint="user profile photo" />
            <AvatarFallback>
                <User className="h-12 w-12" />
            </AvatarFallback>
        </Avatar>
        <DialogTitle className="text-3xl">Your Profile</DialogTitle>
        <DialogDescription>
            Keep your information up-to-date for a seamless experience.
        </DialogDescription>
      </DialogHeader>
      <ProfileForm />
    </DialogContent>
  );

  return (
    <header className={cn(
        "sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm"
    )}>
      <div className="container flex h-16 items-center">
        {/* Left Section */}
        <div className="flex items-center justify-start md:flex-1">
          <Link href="/" className="flex items-center space-x-2">
            <Stethoscope className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">
              Emerald Health
            </span>
          </Link>
        </div>

        {/* Center Section: Desktop Navigation */}
        <nav className="hidden items-center justify-center space-x-6 text-sm font-medium md:flex">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-primary text-foreground/60">
              {link.label}
            </Link>
          ))}
        </nav>
        
        {/* Right Section: Auth & Mobile Menu */}
        <div className="flex flex-1 items-center justify-end space-x-2">
            <div className="hidden md:flex items-center gap-2">
                {isLoggedIn ? (
                  <>
                    <Button variant="ghost" onClick={handleLogout}>Logout</Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <User className="h-5 w-5" />
                          <span className="sr-only">Profile</span>
                        </Button>
                      </DialogTrigger>
                      {profileDialog}
                    </Dialog>
                  </>
                ) : (
                <>
                    <Button variant="ghost" asChild>
                    <Link href="/login">Login</Link>
                    </Button>
                    <Button asChild>
                    <Link href="/signup">Sign Up</Link>
                    </Button>
                </>
                )}
            </div>
            <div className="md:hidden">
            <Sheet>
                <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                  <div className="p-4">
                    <Link href="/" className="mr-6 flex items-center space-x-2 mb-6">
                      <Stethoscope className="h-6 w-6 text-primary" />
                      <span className="font-bold">
                        Emerald Health
                      </span>
                    </Link>
                    <nav className="flex flex-col gap-4">
                        {navLinks.map(link => (
                        <SheetClose asChild key={link.href}>
                            <Link href={link.href} className="block px-2 py-1 text-lg">
                                {link.label}
                            </Link>
                        </SheetClose>
                        ))}
                    </nav>
                  </div>
                  <div className="border-t pt-4 mt-4 p-4">
                    {isLoggedIn ? (
                        <div className="flex items-center gap-2">
                            <SheetClose asChild>
                              <Button variant="outline" className="w-full" onClick={handleLogout}>Logout</Button>
                            </SheetClose>
                            <Dialog>
                              <DialogTrigger asChild>
                                <SheetClose asChild>
                                  <Button variant="default" className="w-full">
                                      <User className="mr-2 h-4 w-4" />
                                      Profile
                                  </Button>
                                </SheetClose>
                              </DialogTrigger>
                              {profileDialog}
                            </Dialog>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            <SheetClose asChild>
                              <Button variant="ghost" asChild>
                                <Link href="/login">Login</Link>
                              </Button>
                            </SheetClose>
                            <SheetClose asChild>
                              <Button asChild>
                                <Link href="/signup">Sign Up</Link>
                              </Button>
                            </SheetClose>
                        </div>
                    )}
                  </div>
                </SheetContent>
            </Sheet>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
