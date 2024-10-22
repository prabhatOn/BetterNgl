export default function FeatureCard({ title, description }: { title: string; description: string }) {
    return (
        <div className="relative z-10 rounded-lg bg-zinc-900/50 backdrop-blur-sm p-6 transition-all duration-300 hover:bg-zinc-800/50">
            <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
            <p className="text-zinc-400">{description}</p>
        </div>
    );
}
