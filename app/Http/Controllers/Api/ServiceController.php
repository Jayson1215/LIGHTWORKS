<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ServiceController extends Controller
{
    public function index(Request $request)
    {
        $query = Service::with('category');

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('available')) {
            $query->where('is_available', true);
        }

        $services = $query->get();
        return response()->json($services);
    }

    public function store(Request $request)
    {
        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'duration_hours' => 'required|integer|min:1',
            'image' => 'nullable|image|max:2048',
            'inclusions' => 'nullable|array',
            'is_available' => 'boolean',
        ]);

        $data = $request->only('category_id', 'name', 'description', 'price', 'duration_hours', 'inclusions', 'is_available');
        $data['slug'] = Str::slug($request->name);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('services', 'public');
        }

        $service = Service::create($data);
        $service->load('category');
        return response()->json($service, 201);
    }

    public function show(Service $service)
    {
        $service->load('category');
        return response()->json($service);
    }

    public function update(Request $request, Service $service)
    {
        $request->validate([
            'category_id' => 'sometimes|exists:categories,id',
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'price' => 'sometimes|numeric|min:0',
            'duration_hours' => 'sometimes|integer|min:1',
            'image' => 'nullable|image|max:2048',
            'inclusions' => 'nullable|array',
            'is_available' => 'boolean',
        ]);

        $data = $request->only('category_id', 'name', 'description', 'price', 'duration_hours', 'inclusions', 'is_available');
        if ($request->has('name')) {
            $data['slug'] = Str::slug($request->name);
        }

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('services', 'public');
        }

        $service->update($data);
        $service->load('category');
        return response()->json($service);
    }

    public function destroy(Service $service)
    {
        $service->delete();
        return response()->json(['message' => 'Service deleted successfully']);
    }
}
