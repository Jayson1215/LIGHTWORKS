<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Portfolio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PortfolioController extends Controller
{
    public function index(Request $request)
    {
        $query = Portfolio::with('category');

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('featured')) {
            $query->where('featured', true);
        }

        $portfolios = $query->latest()->get();
        return response()->json($portfolios);
    }

    public function store(Request $request)
    {
        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'required|image|max:5120',
            'featured' => 'boolean',
        ]);

        $data = $request->only('category_id', 'title', 'description', 'featured');

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('portfolios', 'public');
        }

        $portfolio = Portfolio::create($data);
        $portfolio->load('category');
        return response()->json($portfolio, 201);
    }

    public function show(Portfolio $portfolio)
    {
        $portfolio->load('category');
        return response()->json($portfolio);
    }

    public function update(Request $request, Portfolio $portfolio)
    {
        $request->validate([
            'category_id' => 'sometimes|exists:categories,id',
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:5120',
            'featured' => 'boolean',
        ]);

        $data = $request->only('category_id', 'title', 'description', 'featured');

        if ($request->hasFile('image')) {
            if ($portfolio->image) {
                Storage::disk('public')->delete($portfolio->image);
            }
            $data['image'] = $request->file('image')->store('portfolios', 'public');
        }

        $portfolio->update($data);
        $portfolio->load('category');
        return response()->json($portfolio);
    }

    public function destroy(Portfolio $portfolio)
    {
        if ($portfolio->image) {
            Storage::disk('public')->delete($portfolio->image);
        }
        $portfolio->delete();
        return response()->json(['message' => 'Portfolio item deleted successfully']);
    }
}
