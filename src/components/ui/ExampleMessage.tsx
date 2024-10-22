const ExampleMessage = ({ content }: { content: string }) => (
    <div className="relative z-10 rounded-lg bg-zinc-800/50 backdrop-blur-sm p-4 text-zinc-300">
        {content}
    </div>
);

export default ExampleMessage;
