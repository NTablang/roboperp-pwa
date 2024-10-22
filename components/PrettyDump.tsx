import React from 'react'

function PrettyDump({ data }: { data: any }) {
	return (
		<pre className='text-sm bg-black text-white whitespace-pre-wrap break-words mt-14'>
			{JSON.stringify(data, null, 2)}
		</pre>
	)
}

export default PrettyDump
