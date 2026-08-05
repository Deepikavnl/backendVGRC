import { useParams } from "react-router-dom";

export function TopicDetailPage() {

    const { id } = useParams();

    return (
        <div>
            <h1>Topic Details</h1>
            <p>Topic ID: {id}</p>
        </div>
    );
}