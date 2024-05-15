import React from 'react'
import { Button } from '../ui/button'
import { BiCoinStack } from 'react-icons/bi'

type Mining = {
    mined: number
    mining: number
    time: string
    rate: number
}

const MiningStats = (props: Mining) => {
    return (
        <div className="mining-stats">
            <h3 className='text-lg'>
                $FOUND Mined:{" "}
                <span>{props.mined}</span>
            </h3>
            <p>Mining: {props.mining}</p>
            <p>{props.time}</p>
            <div>
                <div className="tag">
                    Mining rate : <span className='font-normal'>{props.rate} FOUND/hr</span>
                </div>
                <Button className="tag gap-2">
                    Start Mining <BiCoinStack className="shrink-0" />
                </Button>
            </div>
        </div>)
}

export default MiningStats;