import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Radio } from "lucide-react";

interface FeatureCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
    return (
        <Card className="border-2 relative">
            <CardHeader>
                <Icon className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-xl">{title}</CardTitle>
            </CardHeader>
            {
                (title === "Task Management" || title === "Custom Workflows") && <Radio className="text-red-500 absolute top-8 right-8" />
            }
            <CardContent>
                <p className="text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );
}