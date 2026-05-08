import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Props {
  title?: string;
  message: string;
  actionText?: string;
  onActionClick?: () => void;
}

export function FullScreenError({
  title = "Noe gikk galt",
  message,
  actionText = "Gå tilbake",
  onActionClick,
}: Props) {
  const navigate = useNavigate();

  const handleAction = () => {
    if (onActionClick) {
      onActionClick();
    } else {
      navigate("/my-assignments-page");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md mx-auto glass-surface-light shadow-xl border-slate-400/20">
        <CardHeader className="text-center">
          <div className="mx-auto bg-red-100 p-3 rounded-full w-fit">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-forest-900 mt-4">{title}</CardTitle>
          <CardDescription className="text-slate-600">{message}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleAction}
            className="w-full bg-forest-800 text-white hover:bg-forest-900 transition-all hover:shadow-lg"
          >
            {actionText}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
