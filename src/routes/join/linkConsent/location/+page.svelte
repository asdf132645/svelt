<script lang="ts">

    import {locationContent, privacyContent, serviceContent} from "@/utils/consent";
    import {goto} from "$app/navigation";
    import {base} from "$app/paths";
</script>

<div class="popup">
    <div class="app-basic">
        <div class="header">
            <h2>이용약관</h2>
            <button type="button" class="btn-popup-close"  on:click={() => goto(`${base}/login`)}></button>
        </div>
        <div class="app-hdWrap-tab relative">
            <div class="open-main-mypage pt-2 pb-2">
                <p class="subject-wrap">위치기반서비스 이용약관</p>
            </div>
        </div>
        <div class="app-container pt-2 no-pad">
            <div class="open-main-mypage">
				<pre class="bodyTxt" style="white-space: pre-wrap;">
                    {locationContent}
				</pre>
            </div>
        </div>
    </div>
</div>

