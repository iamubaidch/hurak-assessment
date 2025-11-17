<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Box;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class GenerateBoxes extends Command
{
    protected $signature = 'boxes:generate';
    protected $description = 'Generate boxes every minute and stop at 16';

    public function handle()
    {
        if (Cache::has('boxes:completed')) {
            $count = Box::count();
            if ($count < 16) {
                Cache::forget('boxes:completed');
                $this->info('Found stale completion flag — clearing and continuing generation.');
            } else {
                $this->info('Boxes generation already completed.');
                return;
            }
        }

        $currentCount = Box::count();

        $newCount = ($currentCount == 0) ? 1 : $currentCount * 2;
        $newCount = min(16, $newCount);

        $colors = ['red', 'yellow', 'green', 'blue', 'pink', 'grey'];

        for ($i = 0; $i < $newCount - $currentCount; $i++) {
            Box::create([
                'height' => 40,
                'width' => 100,
                'color' => $colors[array_rand($colors)],
            ]);
        }

        $this->info("Generated $newCount boxes");

        if (Box::count() >= 16) {
            try {
                Mail::raw(
                    "1st Task Done - Muhammad Ubaidullah",
                    function ($message) {
                        $message->to('Dawood.ahmed@collaborak.com')
                            ->subject('1st Task Done - Muhammad Ubaidullah');
                    }
                );

                Cache::forever('boxes:completed', true);
                $this->info('16 reached. Email sent. Stopping further generation.');
                Log::info('Boxes generation completed and notification email sent.', [
                    'boxes_count' => Box::count(),
                    'recipient' => 'Dawood.ahmed@collaborak.com',
                    'subject' => '1st Task Done - Muhammad Ubaidullah',
                ]);
            } catch (\Exception $e) {
                $this->error('Reached 16 boxes but failed to send email: ' . $e->getMessage());
                Cache::forever('boxes:completed', true);
                Log::error('Failed to send boxes completion email.', [
                    'error' => $e->getMessage(),
                    'boxes_count' => Box::count(),
                ]);
            }
        }
    }
}
