export async function getNews() {
    const res = await fetch('https://gnews.io/api/v4/top-headlines?country=in&lang=en&max=10&token=d564f39d6c1916192ff167fdd722d823')
    const data = await res.json()
    return data
}