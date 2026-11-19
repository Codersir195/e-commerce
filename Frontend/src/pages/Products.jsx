import FilterSidebar from '@/components/FilterSidebar'
import ProductCard from '@/components/ProductCard'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { setProducts } from '@/redux/productSlice'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'

export default function Products() {
    const { products } = useSelector(store => store.product)
    const [allProducts, setAllProducts] = useState([])
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All")
    const [brand, setBrand] = useState("All")
    const [priceRange, setPriceRange] = useState([0, 999999])
    const [sortOrder, setSortOrder] = useState('');
    const dispatch = useDispatch()

    const getAllProducts = async () => {
        try {
            setLoading(true)
            const res = await axios.get(`${import.meta.env.VITE_URL}/api/product/getallproduct`);
            if (res.data.success) {
                setAllProducts(res.data.products)
                dispatch(setProducts(res.data.products))
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (allProducts.length === 0) return;

        let filtered = [...allProducts]

        if (search.trim() !== " ") {
            filtered = filtered.filter(p => p.productName?.toLowerCase().includes(search.toLowerCase()))
        }

        if (category !== "All") {
            filtered = filtered.filter(p => p.category === category)
        }

        if (brand !== "All") {
            filtered = filtered.filter(p => p.brand === brand)
        }

        filtered = filtered.filter(p => p.productPrice >= priceRange[0] && p.productPrice <= priceRange[1])

        if (sortOrder === "lowToHigh") {
            filtered.sort((a, b) => a.productPrice - b.productPrice)
        } else if (sortOrder === "highToLow") {
            filtered.sort((a, b) => b.productPrice - a.productPrice)
        }

        dispatch(setProducts(filtered))
    },[search, category, brand, sortOrder, priceRange, allProducts, dispatch])

    useEffect(() => {
        getAllProducts()
    }, [])

    return (
        <div className='pt-20 pb-10'>
            <div className='max-w-7xl mx-auto flex gap-7'>
                {/* sideber */}
                <FilterSidebar
                    search={search}
                    setSearch={setSearch}
                    brand={brand}
                    setBrand={setBrand}
                    category={category}
                    setCategory={setCategory}
                    allProducts={allProducts}
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                />

                {/* mail product sections */}
                <div className='flex flex-col flex-1'>
                    <div className='flex mb-4 justify-end'>
                        <Select onValueChange={(value)=>setSortOrder(value)}>
                            <SelectTrigger className="w-50">
                                <SelectValue placeholder="Sort by Price" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="lowToHigh">Price: Low to High</SelectItem>
                                    <SelectItem value="highToLow">Price: High to Low</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    {/* product grid */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-7'>
                        {
                            products.map((product) => {
                                return <ProductCard key={product._id} product={product} loading={loading} />
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

