
import { Button } from './ui/button'
import { ArrowRight } from 'lucide-react'
import { FeatureCard } from './FeatureCard'
import { ModeToggle } from './ui/mode-toggle'
import { ListTodo, Users, Calendar, Sparkles } from 'lucide-react'

const Landing = () => {



    const googleLogin = () => {
        window.open(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/auth/google`, '_self');
    };
    const githubLogin = () => {
        window.open(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/auth/github`, '_self');
    };

    return (
        <div>
            <nav className="border-b">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        {/* <Layout className="h-6 w-6" /> */}
                        <img src="./logo.svg" alt="" />
                        <span className="font-bold text-xl">Easetasks</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <ModeToggle />
                        <Button onClick={githubLogin}>Get Started</Button>
                    </div>
                </div>
            </nav>
            <section className="py-20 px-4">
                <div className="container mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Manage Projects with Ease
                    </h1>
                    <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Transform your workflow with our intuitive Kanban board. Visualize
                        tasks, collaborate with your team, and boost productivity.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Button onClick={githubLogin} size="lg" className="gap-2">
                            Start for Free <ArrowRight className="h-4 w-4" />
                        </Button>
                        {/* <Button size="lg" variant="outline">
                            Learn More
                        </Button> */}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 px-4 bg-muted/50">
                <div className="container mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        Everything you need to stay organized
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <FeatureCard
                            icon={ListTodo}
                            title="Task Management"
                            description="Create, organize, and track tasks with our intuitive drag-and-drop interface."
                        />
                        <FeatureCard
                            icon={Users}
                            title="Team Collaboration"
                            description="Work together seamlessly with real-time updates and team assignments."
                        />
                        <FeatureCard
                            icon={Calendar}
                            title="Deadline Tracking"
                            description="Stay on schedule with built-in deadline management and reminders."
                        />
                        <FeatureCard
                            icon={Sparkles}
                            title="Custom Workflows"
                            description="Adapt the board to your needs with customizable columns and labels."
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4">
                <div className="container mx-auto text-center">
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-3xl font-bold mb-4">
                            Ready to streamline your workflow?
                        </h2>
                        <p className="text-muted-foreground mb-8">
                            Join Easetasks to manage their
                            projects effectively.
                        </p>
                        <Button onClick={googleLogin} size="lg" className="gap-2">
                            Get Started Now <ArrowRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t py-8">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            {/* <Layout className="h-5 w-5" /> */}
                            <span className="font-semibold">Easetasks</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            © 2024 Easetasks. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer></div>
    )
}

export default Landing