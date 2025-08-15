import { useState, type FC } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { RegisterForm } from './RegisterForm';
import { Sun, Moon } from 'lucide-react';
import { Button } from '../ui/button';
import { LoginForm } from './LoginForm';
import { useThemeStore } from '../../stores/theme.store';

export const AuthPage: FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { theme, toggleTheme } = useThemeStore();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-goodent-light via-background to-goodent-accent/20 p-4">
      {/* Theme Toggle */}
      <Button
        variant="outline"
        size="icon"
        className="absolute top-4 right-4"
        onClick={toggleTheme}
      >
        {theme === 'dark' ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )}
      </Button>

      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <div className="w-60 h-60 bg-gradient-to-br from-goodent-primary to-goodent-secondary rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
            {/* <span className="text-white text-2xl font-bold">G</span> */}
            <img src="/assets/img/logo.png" alt="Good Dental Logo" className="w-50 h-20" />
          </div>
          {/* <h1 className="text-3xl font-bold text-goodent-primary mb-2">{import.meta.env.VITE_APP_TITLE ?? "Clinical"}</h1> */}
          <p className="text-muted-foreground">Sistema de Gestión Odontológica</p>
        </div>

        {/* Form Card */}
        <Card className="shadow-2xl border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </CardTitle>
            <CardDescription className="text-center">
              {isLogin 
                ? 'Ingresa tus credenciales para acceder al sistema'
                : 'Completa el formulario para crear tu cuenta'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLogin ? <LoginForm /> : <RegisterForm />}
          </CardContent>
        </Card>

        {/* Toggle Form */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
          </p>
          <Button
            variant="link"
            className="text-goodent-primary hover:text-goodent-primary/80"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Crear cuenta' : 'Iniciar sesión'}
          </Button>
        </div>

        {/* Demo Credentials */}
        {/* <Card className="bg-goodent-light/50 border-goodent-primary/20">
          <CardContent className="pt-6">
            <h4 className="text-sm font-medium text-goodent-primary mb-3">
              Credenciales de Demo:
            </h4>
            <div className="space-y-2 text-xs">
              <div>
                <span className="font-medium">Administrador:</span>
                <br />
                <span className="text-muted-foreground">admin@goodent.com / 123456</span>
              </div>
              <div>
                <span className="font-medium">Empleado:</span>
                <br />
                <span className="text-muted-foreground">empleado@goodent.com / 123456</span>
              </div>
            </div>
          </CardContent>
        </Card> */}
      </div>
        <span className="fixed bottom-4 left-4 text-xs text-muted-foreground opacity-70">Ver. {import.meta.env.VITE_VERSION}</span>
    </div>
  );
};