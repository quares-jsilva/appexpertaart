import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getTurns, getPrevTurns } from '@/Store/Turn'

const useTurns = ({type}) => {
    
    const dispatch = useDispatch()
    const[hasTurns, setHasTurn] = useState(false)
    const[firstTurn, setFirstTurn] = useState(null)
    const [lastTurn, setLastTurn] = useState(false)
    const { turns, prevTurns, status, loading } = useSelector((state) => state.turn)
    const { myClaims } = useSelector((state) => state.claim)
    const nextMonth = new Date((+new Date) + 8035200000)
    const lastMonth = new Date((+new Date) - 8035200000)

    useEffect(() => {
        if(!loading && myClaims.length > 0 && (turns.length === 0 || prevTurns.length === 0 || status === 'error')) {
            if(type === "nexts") {
                dispatch(getTurns({
                    claims: myClaims,
                    fechaHasta: nextMonth
                }))
            } else {
                dispatch(getPrevTurns({
                    claims: myClaims,
                    fechaDesde: lastMonth
                }))
            }
            
        }
    }, [myClaims, type])

    useEffect(() => {
        if(turns.length > 0) {
            setHasTurn(true)
            setFirstTurn(turns[0])
        }
    }, [turns])
    

    return {hasTurns, firstTurn, turns, prevTurns, loading, lastTurn}
}

export { useTurns }