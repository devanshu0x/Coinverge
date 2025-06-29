import { Card } from "@repo/ui/card"

export const OnRampTransactions = ({
    transactions
}: {
    transactions: {
        time: Date,
        amount: number,
        // TODO: Can the type of `status` be more specific?
        status: string,
        provider: string
    }[]
}) => {
    if (!transactions.length) {
        return <Card title="Recent Transactions">
            <div className="text-center pb-8 pt-8">
                No Recent transactions
            </div>
        </Card>
    }
    return <Card title="Recent Transactions">
        <div className="pt-2">
            {transactions.map(t => <div key={t.time.toString()} className="flex justify-between">
                <div >
                    <div className="text-sm">
                        {t.status==="Success"?"Received INR": t.status==="Processing"? "Pending INR":"Failed"}
                    </div>
                    <div className="text-slate-600 text-xs">
                        {t.time.toDateString()}
                    </div>
                </div>
                <div className={`flex flex-col justify-center ${t.status==="Success"? "text-green-400":t.status==="Processing"?"text-blue-400":"text-red-400"}`}>
                    + Rs {t.amount / 100}
                </div>

            </div>)}
        </div>
    </Card>
}