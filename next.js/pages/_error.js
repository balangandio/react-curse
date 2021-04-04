import React from 'react';
import Link from 'next/link';

const errorPage = () => (
    <div>
        <h1>Ops, something went wrong.</h1>
        <p>Try <Link href="/"><a>goin back</a></Link>.</p>
    </div>
);

export default errorPage; 