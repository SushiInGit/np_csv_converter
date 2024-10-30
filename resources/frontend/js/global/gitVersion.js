var global = global ?? {};

global.gitVersion = function () {
    const repoUrl = 'https://api.github.com/repos/SushiInGit/np_csv_converter/branches/main';
    const storageKey = 'lastUpdateDate';
    const fallbackDate = '20241020'; // Fallback date in YYYYMMDD format

    const storedDate = sessionStorage.getItem(storageKey);
    if (storedDate) {
        updateVersion(storedDate);
    } else {
        fetch(repoUrl)
            .then(response => {
                if (!response.ok) {
                    updateVersion(fallbackDate);
                    return; 
                }
                return response.json();
            })
            .then(data => {
                if (data && data.commit.commit.committer.date) {
                    const lastUpdateDateStr = data.commit.commit.committer.date;
                    const lastUpdateDate = new Date(lastUpdateDateStr);
                    
                    if (isNaN(lastUpdateDate)) {
                        updateVersion(fallbackDate);
                        return; 
                    }

                    const formattedDate = lastUpdateDate.toISOString().split('T')[0]; 
                    const [year, month, day] = formattedDate.split('-'); 
                    const displayDate = `${year}${month}${day}`; 
                    sessionStorage.setItem(storageKey, displayDate);
                    updateVersion(displayDate);
                } else {
                    updateVersion(fallbackDate);
                }
            })
            .catch(error => {
                console.error(`Failed to fetch repository data: ${error.message}. Using fallback date.`);
                // Use the fallback date if there's an error
                updateVersion(fallbackDate);
            });
    }
};


function updateVersion(date) {
    const versionElement = document.querySelector('.grid-wrapper .banner .left h3');
    const currentVersion = versionElement.innerHTML.split('<br>')[1]; 
    versionElement.innerHTML = `NP CONVERTER<br> Ver. ${date.replace(/-/g, '')}`; // Update with new date
    //console.log(`Version updated from ${currentVersion} to ${date.replace(/-/g, '')}`);
}


global.gitVersion();
