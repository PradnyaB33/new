import React from 'react'

const HeadingOneLineInfo = ({ heading, info }) => {
    return (
        <div style={{ marginBottom: "2%" }}>
            <h1 className="md:text-2xl text-lg font-semibold">
                {heading}
            </h1>
            <p className="text-gray-600">
                {info}
            </p>
        </div>
    )
}

export default HeadingOneLineInfo
