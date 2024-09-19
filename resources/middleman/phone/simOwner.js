var middleman = middleman ?? {};

middleman.simOwner = function () {
    const messages = middleman.phoneData.all()
    
    function MostFrequentNumber(messages) {                         // Get Main used Number (hint how is the owner)
        const numberCount = {}
        messages.forEach(msg => {
            numberCount[msg.From] = (numberCount[msg.From] || 0) + 1;
            numberCount[msg.To] = (numberCount[msg.To] || 0) + 1;
        });
        let Number = null;
        let maxCount = 0;
        for (const number in numberCount) {
            if (numberCount[number] > maxCount) {
                maxCount = numberCount[number];
                Number = parseInt(number);
            }
        }
        return { number: Number, count: maxCount };
    }
   
return {
    number: () => { return MostFrequentNumber(messages).number },
    count: () => { return MostFrequentNumber(messages).count }
    }
}
();