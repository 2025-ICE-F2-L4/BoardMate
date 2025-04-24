import React, { useState } from 'react';
import '../styles/components/AdminPanel.css';

const AdminPanel = () => {
    const [sqlQuery, setSqlQuery] = useState('');
    const [queryResult, setQueryResult] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const executeQuery = async () => {
        if (!sqlQuery.trim()) {
            setError('Query cannot be empty');
            return;
        }

        setIsLoading(true);
        setError(null);
        setQueryResult(null);

        try {
            const response = await fetch('https://boardmate.onrender.com/admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sqlInjection: sqlQuery }), 
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to execute query');
            }

            setQueryResult(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const formatResult = (result) => {
        if (!result) return null;
        
        if (Array.isArray(result)) {
            if (result.length === 0) {
                return <p>Query executed successfully. No rows returned.</p>;
            }

            const columns = Array.from(
                new Set(result.flatMap(row => Object.keys(row)))
            );

            return (
                <div className="query-result-table">
                    <p>{result.length} rows returned</p>
                    <table>
                        <thead>
                            <tr>
                                {columns.map(col => (
                                    <th key={col}>{col}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {result.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {columns.map(col => (
                                        <td key={`${rowIndex}-${col}`}>
                                            {row[col] !== undefined ? String(row[col]) : 'NULL'}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        } else {
            return (
                <p>
                    Query executed successfully.
                    {result.affectedRows !== undefined && ` ${result.affectedRows} rows affected.`}
                </p>
            );
        }
    };

    return (
        <div className="admin-panel">
            <h1>Database Admin Panel</h1>
            <div className="admin-warning">
                ⚠️ Warning: This panel allows direct database manipulation. Use with caution.
            </div>
            
            <div className="query-input-container">
                <h3>SQL Query</h3>
                <textarea
                    className="sql-input"
                    value={sqlQuery}
                    onChange={(e) => setSqlQuery(e.target.value)}
                    placeholder="Enter your SQL query here..."
                    rows={8}
                />
                <button 
                    className="execute-query-button"
                    onClick={executeQuery}
                    disabled={isLoading}
                >
                    {isLoading ? 'Executing...' : 'Execute Query'}
                </button>
            </div>
            
            <div className="query-result-container">
                <h3>Result</h3>
                {error && <div className="error-message">{error}</div>}
                {queryResult && formatResult(queryResult)}
            </div>
        </div>
    );
};

export default AdminPanel;