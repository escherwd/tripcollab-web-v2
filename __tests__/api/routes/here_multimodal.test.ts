/**
 * @jest-environment node
 */
import { serverCalculateMultimodalRoute } from "@/app/api/routes/here_multimodal"

it('should calculate a multimodal route', async () => {
    // This route is from Frankfurt to Bacharach
    const route = await serverCalculateMultimodalRoute({ lat: 50.106598529938935, lng: 8.663275639686537 }, { lat: 50.05977817069105, lng: 7.76849543556396 })
    expect(route).toBeDefined()
    expect(route.routes.length).toBeGreaterThan(0)
})